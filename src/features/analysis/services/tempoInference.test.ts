import { describe, expect, it } from "vitest";
import { buildBeatGrid, estimateTempoFromOnsets } from "./tempoInference";

function generateBeatOnsets(bpm: number, count: number, offset = 0): number[] {
  const beatSeconds = 60 / bpm;
  return Array.from({ length: count }, (_, index) => offset + index * beatSeconds);
}

describe("estimateTempoFromOnsets", () => {
  it("returns undefined when there are fewer than four onsets", () => {
    expect(estimateTempoFromOnsets([])).toBeUndefined();
    expect(estimateTempoFromOnsets([0, 0.5, 1])).toBeUndefined();
  });

  it("recovers a 120 bpm grid from clean onsets", () => {
    const onsets = generateBeatOnsets(120, 12);
    const estimate = estimateTempoFromOnsets(onsets);

    expect(estimate).toBeDefined();
    expect(estimate?.bpm).toBeCloseTo(120, 1);
    expect(estimate?.confidence).toBeGreaterThan(0.8);
  });

