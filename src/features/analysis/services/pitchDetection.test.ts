import { describe, expect, it } from "vitest";
import {
  analyzePitchFrames,
  estimateFundamentalFrequency,
  frequencyToPitch,
  groupPitchFrames,
} from "./pitchDetection";

describe("pitchDetection", () => {
  it("estimates a simple sine wave frequency", () => {
    const sampleRate = 8_000;
    const samples = createSineWave(110, sampleRate, 0.25);
    const estimate = estimateFundamentalFrequency(samples, sampleRate, {
      correlationThreshold: 0.5,
      frameSize: samples.length,
      hopSize: samples.length,
      maxFrequencyHz: 300,
      minDurationSeconds: 0.05,
      minFrequencyHz: 60,
      rmsThreshold: 0.01,
    });

    expect(estimate?.frequencyHz).toBeCloseTo(110, 0);
    expect(estimate?.confidence).toBeGreaterThan(0.8);
  });

  it("ignores low-energy frames", () => {
    const estimate = estimateFundamentalFrequency(new Float32Array(1024), 8_000, {
      correlationThreshold: 0.5,
      frameSize: 1024,
      hopSize: 512,
      maxFrequencyHz: 300,
      minDurationSeconds: 0.05,
      minFrequencyHz: 60,
      rmsThreshold: 0.01,
    });

    expect(estimate).toBeUndefined();
  });

  it("analyzes pitch frames and maps them to pitch names", () => {
    const sampleRate = 8_000;
    const samples = createSineWave(110, sampleRate, 0.4);
    const frames = analyzePitchFrames(samples, sampleRate, {
      correlationThreshold: 0.5,
      frameSize: 1024,
      hopSize: 512,
      maxFrequencyHz: 300,
      minFrequencyHz: 60,
      rmsThreshold: 0.01,
    });

    expect(frames.length).toBeGreaterThan(1);
    expect(frames[0].pitch).toBe("A2");
  });

  it("groups adjacent frames with the same pitch", () => {
    const notes = groupPitchFrames([
      frame("A2", 0),
      frame("A2", 0.05),
