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
