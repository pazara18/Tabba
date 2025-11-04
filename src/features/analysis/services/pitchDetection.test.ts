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
      correlationThreshold: 0.5,
      frameSize: samples.length,
      hopSize: samples.length,
      maxFrequencyHz: 300,
      minDurationSeconds: 0.05,
      minFrequencyHz: 60,
      rmsThreshold: 0.01,
    });

    expect(estimate?.frequencyHz).toBeCloseTo(110, 0);
    expect(estimate?.confidence).toBeGreaterThan(0.8);
  });

  it("ignores low-energy frames", () => {
    const estimate = estimateFundamentalFrequency(new Float32Array(1024), 8_000, {
      correlationThreshold: 0.5,
      frameSize: 1024,
      hopSize: 512,
      maxFrequencyHz: 300,
      minDurationSeconds: 0.05,
      minFrequencyHz: 60,
      rmsThreshold: 0.01,
    });

    expect(estimate).toBeUndefined();
  });

  it("analyzes pitch frames and maps them to pitch names", () => {
    const sampleRate = 8_000;
    const samples = createSineWave(110, sampleRate, 0.4);
    const frames = analyzePitchFrames(samples, sampleRate, {
      correlationThreshold: 0.5,
      frameSize: 1024,
      hopSize: 512,
      maxFrequencyHz: 300,
      minFrequencyHz: 60,
      rmsThreshold: 0.01,
    });

    expect(frames.length).toBeGreaterThan(1);
    expect(frames[0].pitch).toBe("A2");
  });

  it("groups adjacent frames with the same pitch", () => {
    const notes = groupPitchFrames([
      frame("A2", 0),
      frame("A2", 0.05),
      frame("C3", 0.1),
      frame("C3", 0.15),
    ], { minDurationSeconds: 0.05 });

    expect(notes.map((note) => note.pitch)).toEqual(["A2", "C3"]);
    expect(notes[0].durationSeconds).toBeCloseTo(0.1);
  });

  it("merges short semitone wobble into one dominant note", () => {
    const notes = groupPitchFrames(
      [
        frame("C2", 0),
        frame("B1", 0.05),
        frame("A#1", 0.1),
        frame("A#1", 0.15),
        frame("A#1", 0.2),
      ],
      {
        minDurationSeconds: 0.05,
        pitchWobbleMergeSeconds: 0.3,
        pitchWobbleSemitones: 2,
      }
    );

    expect(notes).toHaveLength(1);
    expect(notes[0]).toMatchObject({
      durationSeconds: 0.25,
      pitch: "A#1",
      startSeconds: 0,
    });
  });

  it("splits matching pitches separated by a long unvoiced gap", () => {
    const notes = groupPitchFrames(
      [frame("A2", 0), frame("A2", 0.05), frame("A2", 0.5), frame("A2", 0.55)],
      { maxFrameGapSeconds: 0.1, minDurationSeconds: 0.05 }
    );

    expect(notes.map((note) => note.startSeconds)).toEqual([0, 0.5]);
  });

  it("maps frequencies to nearest pitch names", () => {
    expect(frequencyToPitch(440)).toBe("A4");
    expect(frequencyToPitch(41.2)).toBe("E1");
  });
});

function createSineWave(frequencyHz: number, sampleRate: number, durationSeconds: number) {
  const samples = new Float32Array(sampleRate * durationSeconds);

  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = Math.sin((2 * Math.PI * frequencyHz * index) / sampleRate);
  }

  return samples;
}

function frame(pitch: string, startSeconds: number) {
  const frequencies: Record<string, number> = {
    "A#1": 58.27,
    A2: 110,
    B1: 61.74,
    C2: 65.41,
    C3: 130.81,
  };

  return {
    confidence: 0.9,
    durationSeconds: 0.05,
    frequencyHz: frequencies[pitch] ?? 110,
    pitch,
    startSeconds,
  };
}
