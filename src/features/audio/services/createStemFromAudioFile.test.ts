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
      { createId: () => "stem-1" }
    );

    expect(stem).toEqual({
      id: "stem-1",
      name: "lead-guitar",
      offsetSeconds: 0,
      file: {
        name: "lead-guitar.wav",
        type: "audio/wav",
        sizeBytes: 4096,
        lastModifiedMs: 1770000000000,
      },
    });
  });
