import type { DetectedNote } from "../types";

interface NoteOnsetAlignmentOptions {
  hopSize?: number;
  maxLookaheadSeconds?: number;
  maxLookbackSeconds?: number;
  minDurationSeconds?: number;
  minNoteSeparationSeconds?: number;
  onsetRiseRatio?: number;
  rmsThreshold?: number;
  windowSize?: number;
}

interface EnergyOnset {
  rms: number;
  seconds: number;
}

const defaultOptions = {
  hopSize: 128,
  maxLookaheadSeconds: 0.12,
  maxLookbackSeconds: 0.3,
  minDurationSeconds: 0.05,
  minNoteSeparationSeconds: 0.05,
  onsetRiseRatio: 1.35,
  rmsThreshold: 0.012,
  windowSize: 512,
};

export function alignNotesToEnergyOnsets(
  notes: DetectedNote[],
  samples: Float32Array,
  sampleRate: number,
  options: NoteOnsetAlignmentOptions = {}
): DetectedNote[] {
  const settings = { ...defaultOptions, ...options };
  const onsets = detectEnergyOnsets(samples, sampleRate, settings);
  let previousStartSeconds = -Infinity;

  return [...notes].sort((left, right) => left.startSeconds - right.startSeconds).flatMap((note) => {
    const onset = findNearestAvailableOnset(
      note.startSeconds,
      onsets,
      previousStartSeconds,
      settings
    );

    if (
      !onset ||
      onset.seconds < previousStartSeconds + settings.minNoteSeparationSeconds
    ) {
      const splitNotes = splitNoteAtInnerOnsets(note, onsets, settings);
      previousStartSeconds = splitNotes[splitNotes.length - 1]?.startSeconds ?? note.startSeconds;
      return splitNotes;
    }

    const noteEndSeconds = note.startSeconds + note.durationSeconds;
    const alignedNote = {
      ...note,
      durationSeconds: Math.max(settings.minDurationSeconds, noteEndSeconds - onset.seconds),
      startSeconds: onset.seconds,
    };

    const splitNotes = splitNoteAtInnerOnsets(alignedNote, onsets, settings);
    previousStartSeconds = splitNotes[splitNotes.length - 1]?.startSeconds ?? alignedNote.startSeconds;
    return splitNotes;
  });
}

function detectEnergyOnsets(
  samples: Float32Array,
  sampleRate: number,
  settings: Required<NoteOnsetAlignmentOptions>
): EnergyOnset[] {
  const onsets: EnergyOnset[] = [];
  let previousRms = 0;
  let lastOnsetSeconds = -Infinity;

  for (let start = 0; start + settings.windowSize <= samples.length; start += settings.hopSize) {
    const frame = samples.subarray(start, start + settings.windowSize);
    const currentRms = calculateRms(frame);
    const seconds =
      previousRms < settings.rmsThreshold
        ? findFirstActiveSample(samples, start, start + settings.windowSize, settings) / sampleRate
        : start / sampleRate;

    if (
      currentRms >= settings.rmsThreshold &&
      isEnergyRise(currentRms, previousRms, settings) &&
      seconds >= lastOnsetSeconds + settings.minNoteSeparationSeconds
    ) {
      onsets.push({ rms: currentRms, seconds });
      lastOnsetSeconds = seconds;
    }

    previousRms = currentRms;
  }

  return onsets;
}

function findNearestAvailableOnset(
  startSeconds: number,
  onsets: EnergyOnset[],
  previousStartSeconds: number,
  settings: Required<NoteOnsetAlignmentOptions>
): EnergyOnset | undefined {
  const minSeconds = Math.max(
    previousStartSeconds + settings.minNoteSeparationSeconds,
    startSeconds - settings.maxLookbackSeconds
  );
  const maxSeconds = startSeconds + settings.maxLookaheadSeconds;

  const candidates = onsets.filter(
    (onset) => onset.seconds >= minSeconds && onset.seconds <= maxSeconds
  );

  // Prefer onsets at or before the pitch-detected start — these are attack
  // transients that pitch analysis missed due to frame-size latency.
  // Among earlier onsets, pick the closest one (latest before pitch start).
  const earlierOnsets = candidates.filter((onset) => onset.seconds <= startSeconds);

  if (earlierOnsets.length > 0) {
    return earlierOnsets.sort((left, right) => right.seconds - left.seconds)[0];
  }

  // Fall back to nearest lookahead onset when no earlier onset exists.
  return candidates.sort((left, right) => left.seconds - right.seconds)[0];
}

function splitNoteAtInnerOnsets(
  note: DetectedNote,
  onsets: EnergyOnset[],
  settings: Required<NoteOnsetAlignmentOptions>
): DetectedNote[] {
  const noteEndSeconds = note.startSeconds + note.durationSeconds;
  const innerOnsets = onsets
    .map((onset) => onset.seconds)
    .filter(
      (seconds) =>
        seconds >= note.startSeconds + settings.minNoteSeparationSeconds &&
        seconds <= noteEndSeconds - settings.minDurationSeconds
    )
    .sort((left, right) => left - right);

  if (innerOnsets.length === 0) {
    return [note];
  }

  const boundaries = [note.startSeconds, ...innerOnsets, noteEndSeconds];

  return boundaries.slice(0, -1).map((startSeconds, index) => ({
    ...note,
    durationSeconds: Math.max(settings.minDurationSeconds, boundaries[index + 1] - startSeconds),
    startSeconds,
  }));
}

