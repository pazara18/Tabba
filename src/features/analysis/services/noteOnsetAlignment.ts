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
