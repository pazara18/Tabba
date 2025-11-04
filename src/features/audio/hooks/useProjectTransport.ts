import { useCallback, useEffect, useRef, useState } from "react";
import type { LoopRegion } from "../../editor/services/practiceControls";
import {
  normalizeLoopRegion,
  normalizePlaybackRate,
} from "../../editor/services/practiceControls";
import {
  computeStemGain,
  getStemMix,
  isAnyStemSoloed,
  type StemMix,
} from "../services/stemMixState";
import type { RuntimeStemSource } from "../types";

interface UseProjectTransportOptions {
  sources: RuntimeStemSource[];
  mixStates: Record<string, StemMix>;
  loopRegion?: LoopRegion;
  onStemDurationChange?: (stemId: string, durationSeconds: number) => void;
  playbackRate?: number;
}

interface BufferEntry {
  buffer: AudioBuffer;
  fileToken: File;
}

interface SourceEntry {
  source: AudioBufferSourceNode;
  gain: GainNode;
}

interface PlaybackAnchor {
  bufferStartOffset: number;
  contextStartTime: number;
  playbackRate: number;
}

const SOURCE_START_LEAD_SECONDS = 0.04;

export function useProjectTransport({
  sources,
  mixStates,
  loopRegion,
  onStemDurationChange,
  playbackRate = 1,
}: UseProjectTransportOptions) {
  const contextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<string, BufferEntry>>(new Map());
  const sourceEntriesRef = useRef<Map<string, SourceEntry>>(new Map());
  const anchorRef = useRef<PlaybackAnchor | null>(null);
  const pausedOffsetRef = useRef(0);
  const frameRequestRef = useRef<number | undefined>(undefined);
  const loopRegionRef = useRef<LoopRegion | undefined>(loopRegion);
  const playbackRateRef = useRef(normalizePlaybackRate(playbackRate));
  const mixStatesRef = useRef(mixStates);
  const onStemDurationChangeRef = useRef(onStemDurationChange);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSource, setHasSource] = useState(false);
  const [decodeTick, setDecodeTick] = useState(0);

  useEffect(() => {
    loopRegionRef.current = loopRegion;
  }, [loopRegion]);

  useEffect(() => {
    onStemDurationChangeRef.current = onStemDurationChange;
  }, [onStemDurationChange]);

  useEffect(() => {
    mixStatesRef.current = mixStates;
  }, [mixStates]);

  const getContext = useCallback((): AudioContext => {
    if (!contextRef.current) {
      contextRef.current = new AudioContext();
    }
    return contextRef.current;
  }, []);

  const stopFrameUpdates = useCallback(() => {
    if (frameRequestRef.current !== undefined) {
      cancelAnimationFrame(frameRequestRef.current);
      frameRequestRef.current = undefined;
    }
  }, []);

  const computeMaxDuration = useCallback((): number => {
    let max = 0;
    for (const entry of buffersRef.current.values()) {
      if (entry.buffer.duration > max) {
        max = entry.buffer.duration;
      }
    }
    return max;
  }, []);

  const computeLivePosition = useCallback((): number => {
    const anchor = anchorRef.current;
    const context = contextRef.current;

    if (!anchor || !context) {
      return pausedOffsetRef.current;
    }

    const elapsedContextSeconds = Math.max(0, context.currentTime - anchor.contextStartTime);
    const rawOffset =
      anchor.bufferStartOffset + elapsedContextSeconds * anchor.playbackRate;
    const totalDuration = computeMaxDuration();
    const loop = loopRegionRef.current;

    if (loop) {
      const normalized = normalizeLoopRegion(loop, totalDuration);
      if (normalized.enabled && rawOffset >= normalized.endSeconds) {
        const loopDuration = normalized.endSeconds - normalized.startSeconds;
        if (loopDuration > 0) {
          return (
            normalized.startSeconds +
            ((rawOffset - normalized.startSeconds) % loopDuration)
          );
        }
      }
    }

    return Math.min(Math.max(0, rawOffset), totalDuration);
  }, [computeMaxDuration]);

  const teardownAllSources = useCallback(() => {
    const entries = sourceEntriesRef.current;
    sourceEntriesRef.current = new Map();
    anchorRef.current = null;

    for (const { source, gain } of entries.values()) {
      source.onended = null;
      try {
        source.stop();
      } catch {
        // Source may already have stopped.
      }
      source.disconnect();
      gain.disconnect();
    }
  }, []);

  const applyLoopRegionToSource = useCallback(
    (source: AudioBufferSourceNode, buffer: AudioBuffer) => {
      const loop = loopRegionRef.current;

      if (!loop) {
        source.loop = false;
        source.loopStart = 0;
        source.loopEnd = 0;
        return;
      }

      const normalized = normalizeLoopRegion(loop, buffer.duration);
      source.loop = normalized.enabled;
      source.loopStart = normalized.startSeconds;
      source.loopEnd = normalized.endSeconds;
    },
    []
  );

  const startPlaybackAt = useCallback(
    (offsetSeconds: number) => {
      const context = contextRef.current;
      const buffers = buffersRef.current;

      if (!context || buffers.size === 0) {
        return;
      }

      teardownAllSources();

      if (context.state === "suspended") {
        void context.resume();
      }

      const startContextTime = context.currentTime + SOURCE_START_LEAD_SECONDS;
      const rate = playbackRateRef.current;
      const anyStemSoloed = isAnyStemSoloed(mixStatesRef.current);
      const totalDuration = computeMaxDuration();
      const safeOffset = Math.min(Math.max(0, offsetSeconds), totalDuration);

      let activeSourceCount = 0;

      for (const [stemId, { buffer }] of buffers.entries()) {
        if (safeOffset >= buffer.duration) {
          continue;
        }

        const source = context.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = rate;
        applyLoopRegionToSource(source, buffer);

        const gain = context.createGain();
        const mix = getStemMix(mixStatesRef.current, stemId);
        gain.gain.value = computeStemGain(mix, anyStemSoloed);

        source.connect(gain);
        gain.connect(context.destination);

        source.start(startContextTime, safeOffset);
        sourceEntriesRef.current.set(stemId, { source, gain });
        activeSourceCount += 1;
      }

      if (activeSourceCount === 0) {
        return;
      }

      anchorRef.current = {
        bufferStartOffset: safeOffset,
        contextStartTime: startContextTime,
        playbackRate: rate,
      };
      pausedOffsetRef.current = safeOffset;

      setIsPlaying(true);
      setCurrentTime(safeOffset);

      stopFrameUpdates();
      const tick = () => {
        const offset = computeLivePosition();
        pausedOffsetRef.current = offset;
        setCurrentTime(offset);
        frameRequestRef.current = requestAnimationFrame(tick);
      };
      frameRequestRef.current = requestAnimationFrame(tick);
    },
    [
      applyLoopRegionToSource,
      computeLivePosition,
      computeMaxDuration,
      stopFrameUpdates,
      teardownAllSources,
    ]
  );

  // Decode files for any sources we don't already have buffers for; drop removed ones.
  useEffect(() => {
    const buffers = buffersRef.current;
    const knownStemIds = new Set(sources.map((source) => source.stemId));

    // Drop buffers for stems no longer in the project.
    for (const stemId of [...buffers.keys()]) {
      if (!knownStemIds.has(stemId)) {
        buffers.delete(stemId);
      }
    }

    let cancelled = false;
    const context = sources.length > 0 ? getContext() : contextRef.current;

    if (!context) {
      setHasSource(buffers.size > 0);
      setDuration(computeMaxDuration());
      return;
    }

    const pendingSources = sources.filter((source) => {
      const existing = buffers.get(source.stemId);
      return !existing || existing.fileToken !== source.file;
    });

    if (pendingSources.length === 0) {
      setHasSource(buffers.size > 0);
      setDuration(computeMaxDuration());
      return;
    }

    (async () => {
      for (const source of pendingSources) {
        try {
          const arrayBuffer = await source.file.arrayBuffer();
          const buffer = await context.decodeAudioData(arrayBuffer);

          if (cancelled) {
            return;
          }

          buffers.set(source.stemId, { buffer, fileToken: source.file });
          onStemDurationChangeRef.current?.(source.stemId, buffer.duration);
        } catch (error) {
          if (!cancelled) {
            console.error("Failed to decode audio for playback", source.stemId, error);
          }
        }
      }

      if (cancelled) {
        return;
      }

      setHasSource(buffers.size > 0);
      setDuration(computeMaxDuration());
      setDecodeTick((tick) => tick + 1);
    })();

    return () => {
      cancelled = true;
    };
  }, [computeMaxDuration, getContext, sources]);

  // If a new stem was decoded while playing, restart from the current offset
  // so it joins the playback.
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const livePosition = computeLivePosition();
    const playingIds = new Set(sourceEntriesRef.current.keys());
    let needsRestart = false;

    for (const stemId of buffersRef.current.keys()) {
      if (!playingIds.has(stemId)) {
        needsRestart = true;
        break;
      }
    }

    if (needsRestart) {
      startPlaybackAt(livePosition);
    }
    // We intentionally key only on decodeTick: this effect should fire when
    // the decoded set changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodeTick]);

  // Hot-apply mix state to playing sources.
  useEffect(() => {
    const context = contextRef.current;
    if (!context) {
      return;
    }
    const anyStemSoloed = isAnyStemSoloed(mixStates);
    for (const [stemId, { gain }] of sourceEntriesRef.current.entries()) {
      const mix = getStemMix(mixStates, stemId);
      gain.gain.setTargetAtTime(
        computeStemGain(mix, anyStemSoloed),
        context.currentTime,
        0.01
      );
    }
  }, [mixStates]);

  // Hot-apply loop-region changes.
  useEffect(() => {
    for (const { source } of sourceEntriesRef.current.values()) {
      const buffer = source.buffer;
      if (buffer) {
        applyLoopRegionToSource(source, buffer);
      }
    }
  }, [applyLoopRegionToSource, loopRegion]);

  // Hot-apply playback rate by re-anchoring at the current offset.
  useEffect(() => {
    const normalized = normalizePlaybackRate(playbackRate);
    playbackRateRef.current = normalized;

    const context = contextRef.current;
    const entries = sourceEntriesRef.current;

    if (!context || entries.size === 0) {
      return;
    }

    const offset = computeLivePosition();
    for (const { source } of entries.values()) {
      source.playbackRate.value = normalized;
    }
    anchorRef.current = {
      bufferStartOffset: offset,
      contextStartTime: context.currentTime,
      playbackRate: normalized,
    };
    pausedOffsetRef.current = offset;
  }, [computeLivePosition, playbackRate]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      teardownAllSources();
      stopFrameUpdates();
      const context = contextRef.current;
      contextRef.current = null;
      buffersRef.current = new Map();
      if (context) {
        void context.close();
      }
    };
  }, [stopFrameUpdates, teardownAllSources]);

  const play = useCallback(() => {
    if (buffersRef.current.size === 0) {
      return;
    }

    let offset = pausedOffsetRef.current;
    const totalDuration = computeMaxDuration();

    if (offset >= totalDuration) {
      offset = 0;
    }

    const loop = loopRegionRef.current;
    if (loop) {
      const normalized = normalizeLoopRegion(loop, totalDuration);
      if (
        normalized.enabled &&
        (offset < normalized.startSeconds || offset >= normalized.endSeconds)
      ) {
        offset = normalized.startSeconds;
      }
    }

    startPlaybackAt(offset);
  }, [computeMaxDuration, startPlaybackAt]);

  const pause = useCallback(() => {
    if (sourceEntriesRef.current.size === 0) {
      return;
    }

    const offset = computeLivePosition();
    teardownAllSources();
    stopFrameUpdates();
    pausedOffsetRef.current = offset;
    setCurrentTime(offset);
    setIsPlaying(false);
  }, [computeLivePosition, stopFrameUpdates, teardownAllSources]);

  const stop = useCallback(() => {
    teardownAllSources();
    stopFrameUpdates();
    pausedOffsetRef.current = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, [stopFrameUpdates, teardownAllSources]);

  const seek = useCallback(
    (timeSeconds: number) => {
      const totalDuration = computeMaxDuration();
      const nextTime = Math.min(Math.max(0, timeSeconds), totalDuration);

      pausedOffsetRef.current = nextTime;
      setCurrentTime(nextTime);

      if (sourceEntriesRef.current.size > 0) {
        startPlaybackAt(nextTime);
      }
    },
    [computeMaxDuration, startPlaybackAt]
  );

  return {
    currentTime,
    duration,
    hasSource,
    isPlaying,
    pause,
    play,
    seek,
    stop,
  };
}
