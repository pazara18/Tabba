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

  it("keeps extensionless names and falls back for empty names", () => {
    expect(
      createStemFromAudioFile({ name: "bass", type: "audio/mpeg", size: 100 }, {
        createId: () => "stem-2",
      }).name
    ).toBe("bass");

    expect(
      createStemFromAudioFile({ name: "   ", type: "", size: 0 }, {
        createId: () => "stem-3",
      }).name
    ).toBe("Untitled stem");
  });

  it("creates an id with the runtime default id generator", () => {
    const stem = createStemFromAudioFile({
      name: "runtime.wav",
      type: "audio/wav",
      size: 1,
    });

    expect(stem.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });
});
