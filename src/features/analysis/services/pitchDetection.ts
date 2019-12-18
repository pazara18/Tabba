import { midiToPitch } from "../../../domain/pitch/pitchNames";
import type { PitchFrame } from "../types";
export { groupPitchFrames } from "./pitchFrameGrouping";

export interface PitchDetectionOptions {
  correlationThreshold?: number;
  frameSize?: number;
  hopSize?: number;
  maxFrequencyHz?: number;
  maxFrameGapSeconds?: number;
  minDurationSeconds?: number;
  minFrequencyHz?: number;
  pitchWobbleMergeSeconds?: number;
  pitchWobbleSemitones?: number;
  rmsThreshold?: number;
}

interface PitchEstimate {
  confidence: number;
  frequencyHz: number;
}

const defaultOptions = {
  correlationThreshold: 0.62,
  frameSize: 2048,
  hopSize: 1024,
