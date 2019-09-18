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
