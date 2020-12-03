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
