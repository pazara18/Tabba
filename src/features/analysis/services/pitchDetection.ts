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
    }
  }

  return frames;
}

export function estimateFundamentalFrequency(
  frame: Float32Array,
  sampleRate: number,
  options: PitchDetectionOptions = {}
): PitchEstimate | undefined {
  const settings = { ...defaultOptions, ...options };

  if (calculateRms(frame) < settings.rmsThreshold) {
    return undefined;
  }

  const minLag = Math.floor(sampleRate / settings.maxFrequencyHz);
  const maxLag = Math.ceil(sampleRate / settings.minFrequencyHz);
  let bestCorrelation = 0;
  let bestLag = 0;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    const correlation = normalizedCorrelation(frame, lag);

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }

  if (bestLag === 0 || bestCorrelation < settings.correlationThreshold) {
    return undefined;
  }

  return {
    confidence: bestCorrelation,
    frequencyHz: sampleRate / bestLag,
  };
}

export function frequencyToPitch(frequencyHz: number): string {
  const midiNote = Math.round(69 + 12 * Math.log2(frequencyHz / 440));
  return midiToPitch(midiNote);
}

function calculateRms(samples: Float32Array): number {
  const energy = samples.reduce((sum, sample) => sum + sample * sample, 0);
  return Math.sqrt(energy / samples.length);
}

function normalizedCorrelation(samples: Float32Array, lag: number): number {
  let correlation = 0;
  let leftEnergy = 0;
  let rightEnergy = 0;

  for (let index = 0; index + lag < samples.length; index += 1) {
    const left = samples[index];
    const right = samples[index + lag];
    correlation += left * right;
    leftEnergy += left * left;
    rightEnergy += right * right;
  }

  const normalization = Math.sqrt(leftEnergy * rightEnergy);
  return normalization === 0 ? 0 : correlation / normalization;
}
