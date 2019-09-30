import { describe, expect, it } from "vitest";
import { alignNotesToEnergyOnsets } from "./noteOnsetAlignment";

describe("noteOnsetAlignment", () => {
  it("moves a detected note back to the nearby energy onset", () => {
    const sampleRate = 1_000;
    const samples = new Float32Array(1_000);

    for (let index = 120; index < 500; index += 1) {
      samples[index] = 0.08;
    }

    const [note] = alignNotesToEnergyOnsets(
      [
        {
          confidence: 0.9,
          durationSeconds: 0.2,
          frequencyHz: 55,
          pitch: "A1",
          startSeconds: 0.25,
        },
      ],
      samples,
      sampleRate,
      { hopSize: 20, maxLookbackSeconds: 0.2, rmsThreshold: 0.01, windowSize: 20 }
    );

    expect(note.startSeconds).toBeCloseTo(0.12);
    expect(note.durationSeconds).toBeCloseTo(0.33);
  });

  it("leaves notes alone when no nearby onset is found", () => {
    const note = {
      confidence: 0.9,
      durationSeconds: 0.2,
      frequencyHz: 55,
      pitch: "A1",
      startSeconds: 0.25,
    };

    expect(
      alignNotesToEnergyOnsets([note], new Float32Array(1_000), 1_000, {
        hopSize: 20,
        maxLookbackSeconds: 0.2,
        rmsThreshold: 0.01,
        windowSize: 20,
      })
    ).toEqual([note]);
  });

  it("does not collapse later notes onto an earlier phrase onset", () => {
    const sampleRate = 1_000;
    const samples = new Float32Array(1_000);

    for (let index = 100; index < 700; index += 1) {
      samples[index] = 0.08;
    }

    const alignedNotes = alignNotesToEnergyOnsets(
      [
        note("A1", 0.2),
        note("B1", 0.36),
      ],
      samples,
      sampleRate,
      {
        maxLookbackSeconds: 0.3,
        hopSize: 20,
        minNoteSeparationSeconds: 0.05,
        rmsThreshold: 0.01,
        windowSize: 20,
      }
    );

    expect(alignedNotes.map((alignedNote) => alignedNote.startSeconds)).toEqual([0.1, 0.36]);
  });

  it("splits a sustained same-pitch note at repeated energy onsets", () => {
    const sampleRate = 1_000;
    const samples = new Float32Array(1_000);

    for (let index = 100; index < 250; index += 1) {
      samples[index] = 0.04;
    }
    for (let index = 250; index < 500; index += 1) {
      samples[index] = 0.08;
