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
