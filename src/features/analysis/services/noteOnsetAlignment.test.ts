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
