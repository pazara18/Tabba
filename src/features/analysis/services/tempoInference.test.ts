import { describe, expect, it } from "vitest";
import { buildBeatGrid, estimateTempoFromOnsets } from "./tempoInference";

function generateBeatOnsets(bpm: number, count: number, offset = 0): number[] {
  const beatSeconds = 60 / bpm;
  return Array.from({ length: count }, (_, index) => offset + index * beatSeconds);
}
