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
  maxFrequencyHz: 900,
  maxFrameGapSeconds: 0.12,
  minDurationSeconds: 0.08,
  minFrequencyHz: 55,
  pitchWobbleMergeSeconds: 0.18,
  pitchWobbleSemitones: 1,
  rmsThreshold: 0.015,
};

export function analyzePitchFrames(
  samples: Float32Array,
  sampleRate: number,
  options: PitchDetectionOptions = {}
): PitchFrame[] {
  const settings = { ...defaultOptions, ...options };
  const frames: PitchFrame[] = [];

  for (let start = 0; start + settings.frameSize <= samples.length; start += settings.hopSize) {
    const frame = samples.subarray(start, start + settings.frameSize);
    const estimate = estimateFundamentalFrequency(frame, sampleRate, settings);

    if (estimate) {
      frames.push({
        confidence: estimate.confidence,
        durationSeconds: settings.frameSize / sampleRate,
        frequencyHz: estimate.frequencyHz,
        pitch: frequencyToPitch(estimate.frequencyHz),
        startSeconds: start / sampleRate,
      });
