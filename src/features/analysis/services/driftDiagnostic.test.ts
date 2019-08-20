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
}

function runFullPipeline(samples: Float32Array, sampleRate: number) {
  const options = getInstrumentPitchOptions("bass");
  const frames = analyzePitchFrames(samples, sampleRate, options);
  return alignNotesToEnergyOnsets(groupPitchFrames(frames, options), samples, sampleRate);
}

function nearestDetectedTime(detectedTimes: number[], target: number): number {
  return detectedTimes.reduce(
    (best, time) => (Math.abs(time - target) < Math.abs(best - target) ? time : best),
    detectedTimes[0] ?? NaN
  );
}

describe("analysis pipeline drift", () => {
  it("matches known attack times exactly at 44.1 kHz (60 seconds, 60 attacks)", { timeout: 60_000 }, () => {
    const sampleRate = 44_100;
    const attackCount = 60;
    const samples = createEvenlySpacedAttacks({
      attackIntervalSeconds: 1,
      attackCount,
      noteDurationSeconds: 0.5,
      frequencyHz: 82.41,
      sampleRate,
    });

    const detectedTimes = runFullPipeline(samples, sampleRate).map((note) => note.startSeconds);
    const residuals = Array.from({ length: attackCount }, (_, attack) => {
      const expected = attack;
      const detected = nearestDetectedTime(detectedTimes, expected);
      return detected - expected;
    });

    // Every residual should be well under a frame hop; sample-index math is
    // exact, so the only error comes from where the attack falls relative to
    // the hop grid.
    for (const residual of residuals) {
      expect(Math.abs(residual)).toBeLessThan(0.005);
    }
  });

  it("preserves timing when decoded samples are at a different rate than the source file", () => {
    // Simulates decodeAudioData resampling a 44.1 kHz file into a 48 kHz
    // AudioContext — the scenario that would occur on most macOS/Linux systems
    // with a 48 kHz output device. If timing survives this, any perceived
    // drift is NOT coming from the AudioContext sample-rate path.
    const fileSampleRate = 44_100;
    const contextSampleRate = 48_000;
    const attackCount = 30;
    const original = createEvenlySpacedAttacks({
      attackIntervalSeconds: 1,
      attackCount,
      noteDurationSeconds: 0.5,
      frequencyHz: 82.41,
      sampleRate: fileSampleRate,
    });

    const ratio = contextSampleRate / fileSampleRate;
    const resampled = new Float32Array(Math.round(original.length * ratio));

    for (let index = 0; index < resampled.length; index += 1) {
      const sourceIndex = index / ratio;
      const leftIndex = Math.floor(sourceIndex);
      const rightIndex = Math.min(original.length - 1, leftIndex + 1);
      const fraction = sourceIndex - leftIndex;
      resampled[index] =
        original[leftIndex] * (1 - fraction) + original[rightIndex] * fraction;
    }

    const detectedTimes = runFullPipeline(resampled, contextSampleRate).map(
      (note) => note.startSeconds
    );

    for (let attack = 0; attack < attackCount; attack += 1) {
      const detected = nearestDetectedTime(detectedTimes, attack);
      // Within one hop at 48 kHz (~21 ms).
      expect(Math.abs(detected - attack)).toBeLessThan(1024 / contextSampleRate);
    }
  });

  it("realistic bass (varying pitch, 500 ms spacing, 60 s) has no cumulative drift", { timeout: 20_000 }, () => {
    const sampleRate = 44_100;
    const samples = new Float32Array(sampleRate * 60);
    const decayTimeConstant = 0.18;
    const frequenciesHz = [82.41, 110, 146.83, 98, 123.47];
    const attackPositions: Array<{ expectedSeconds: number; frequencyHz: number }> = [];

    for (let attack = 0; attack < 120; attack += 1) {
      const expectedSeconds = attack * 0.5;
      const startSample = Math.round(expectedSeconds * sampleRate);
      const frequencyHz = frequenciesHz[attack % frequenciesHz.length];
      attackPositions.push({ expectedSeconds, frequencyHz });
      const attackLength = Math.round(0.45 * sampleRate);

