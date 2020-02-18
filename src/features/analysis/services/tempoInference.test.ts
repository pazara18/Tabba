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

  it("recovers tempo when onsets are phase-shifted from zero", () => {
    const onsets = generateBeatOnsets(90, 10, 0.37);
    const estimate = estimateTempoFromOnsets(onsets);

    expect(estimate?.bpm).toBeCloseTo(90, 1);
    expect(estimate?.beatOffsetSeconds).toBeCloseTo(0.37, 2);
  });

  it("tolerates small jitter on each onset", () => {
    const clean = generateBeatOnsets(100, 16);
    const jittered = clean.map((time, index) => time + ((index % 2 === 0 ? 1 : -1) * 0.01));

    const estimate = estimateTempoFromOnsets(jittered);

    expect(estimate?.bpm).toBeCloseTo(100, 1);
    expect(estimate?.confidence).toBeGreaterThan(0.6);
  });

  it("folds extreme raw intervals back into the configured BPM range", () => {
    // 240 BPM would be above the default max, but represents a 120 BPM beat.
    const onsets = generateBeatOnsets(240, 20);
    const estimate = estimateTempoFromOnsets(onsets);

    expect(estimate).toBeDefined();
    expect(estimate!.bpm).toBeGreaterThanOrEqual(60);
