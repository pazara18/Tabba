import { describe, expect, it } from "vitest";
import {
  createWaveformPeaks,
  getPeakHeightPercent,
  mergeChannelsToMono,
} from "./waveformPeaks";

describe("waveformPeaks", () => {
  it("returns no peaks for empty input", () => {
