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

