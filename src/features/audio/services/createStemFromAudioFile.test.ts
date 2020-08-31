import { describe, expect, it } from "vitest";
import { createStemFromAudioFile } from "./createStemFromAudioFile";

describe("createStemFromAudioFile", () => {
  it("creates portable stem metadata from a local audio file", () => {
