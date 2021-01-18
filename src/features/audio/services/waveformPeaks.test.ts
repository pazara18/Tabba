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
