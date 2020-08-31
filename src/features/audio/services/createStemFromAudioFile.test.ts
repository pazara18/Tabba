import { describe, expect, it } from "vitest";
import { createStemFromAudioFile } from "./createStemFromAudioFile";

describe("createStemFromAudioFile", () => {
  it("creates portable stem metadata from a local audio file", () => {
    const stem = createStemFromAudioFile(
      {
        name: "lead-guitar.wav",
        type: "audio/wav",
        size: 4096,
        lastModified: 1770000000000,
      },
