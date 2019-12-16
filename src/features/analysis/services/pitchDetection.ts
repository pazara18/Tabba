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
