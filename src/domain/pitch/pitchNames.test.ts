import { describe, expect, it } from "vitest";
import { midiToPitch, pitchToMidi, transposePitch } from "./pitchNames";

describe("pitchNames", () => {
  it("converts pitch names to MIDI notes", () => {
    expect(pitchToMidi("C4")).toBe(60);
    expect(pitchToMidi("E2")).toBe(40);
