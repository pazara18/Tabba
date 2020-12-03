import { describe, expect, it } from "vitest";
import { createProjectFixture } from "../../../test/fixtures/createProjectFixture";
import { findMatchingStemForAudioFile } from "./matchStemSource";

describe("matchStemSource", () => {
  it("matches a reimported audio file to an existing project stem", () => {
    const project = createProjectFixture();

    expect(
      findMatchingStemForAudioFile(
        {
          name: "lead.wav",
          type: "audio/wav",
          size: 2048,
          lastModified: 1770000000000,
        },
        project.stems
      )?.id
    ).toBe("stem-1");
  });

  it("does not match files with different content metadata", () => {
    const project = createProjectFixture();
