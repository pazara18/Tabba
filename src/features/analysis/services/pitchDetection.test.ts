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
