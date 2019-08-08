import { describe, expect, it } from "vitest";
import { getInstrumentPitchOptions } from "./instrumentAnalysisOptions";
import { alignNotesToEnergyOnsets } from "./noteOnsetAlignment";
import { analyzePitchFrames, groupPitchFrames } from "./pitchDetection";

/**
 * Diagnostic harness to verify that the analysis pipeline does not introduce
 * cumulative timing drift. Uses synthetic signals with known attack times and
 * asserts that detected note startSeconds line up to within one frame's worth
 * of latency. If playback feels "drifty over time" despite these tests passing,
 * the drift is on the playback/rendering side (likely an HTMLAudioElement ↔
 * AudioContext timebase mismatch), not in the analysis pipeline.
 */

function createEvenlySpacedAttacks(options: {
  attackIntervalSeconds: number;
  attackCount: number;
