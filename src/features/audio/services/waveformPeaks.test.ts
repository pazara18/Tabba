import { describe, expect, it } from "vitest";
import {
  createWaveformPeaks,
  getPeakHeightPercent,
  mergeChannelsToMono,
} from "./waveformPeaks";

describe("waveformPeaks", () => {
  it("returns no peaks for empty input", () => {
    expect(createWaveformPeaks(new Float32Array(), 32)).toEqual([]);
    expect(createWaveformPeaks(new Float32Array([1]), 0)).toEqual([]);
  });

  it("creates min and max peaks from samples", () => {
    const peaks = createWaveformPeaks(new Float32Array([-1, -0.25, 0.2, 0.75]), 2);

    expect(peaks).toEqual([
      { min: -1, max: 0 },
      { min: 0, max: 0.75 },
    ]);
  });

  it("merges channels into mono samples", () => {
    const merged = mergeChannelsToMono([
      new Float32Array([1, 0.5]),
      new Float32Array([-1, 0.25]),
