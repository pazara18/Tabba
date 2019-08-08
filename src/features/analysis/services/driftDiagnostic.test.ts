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
  noteDurationSeconds: number;
  frequencyHz: number;
  sampleRate: number;
}) {
  const totalSamples = Math.ceil(
    options.attackIntervalSeconds * options.attackCount * options.sampleRate
  );
  const samples = new Float32Array(totalSamples);
  const decayTimeConstant = 0.18;

  for (let attack = 0; attack < options.attackCount; attack += 1) {
    const attackStartSample = Math.round(
      attack * options.attackIntervalSeconds * options.sampleRate
    );
    const attackLengthSamples = Math.round(options.noteDurationSeconds * options.sampleRate);

    for (let offset = 0; offset < attackLengthSamples; offset += 1) {
      const sampleIndex = attackStartSample + offset;

      if (sampleIndex >= totalSamples) {
        break;
      }

      const elapsedSeconds = offset / options.sampleRate;
      const envelope = Math.exp(-elapsedSeconds / decayTimeConstant);
      const phase = (2 * Math.PI * options.frequencyHz * sampleIndex) / options.sampleRate;
      samples[sampleIndex] = 0.6 * envelope * Math.sin(phase);
    }
  }

  return samples;
