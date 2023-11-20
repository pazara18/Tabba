import { describe, expect, it } from "vitest";
import { midiToPitch, pitchToMidi, transposePitch } from "./pitchNames";

describe("pitchNames", () => {
  it("converts pitch names to MIDI notes", () => {
    expect(pitchToMidi("C4")).toBe(60);
    expect(pitchToMidi("E2")).toBe(40);
    expect(pitchToMidi("Bb1")).toBe(34);
  });

  it("converts MIDI notes to sharp pitch names", () => {
    expect(midiToPitch(60)).toBe("C4");
    expect(midiToPitch(63)).toBe("D#4");
  });

  it("transposes pitch names by semitone distance", () => {
    expect(transposePitch("E2", 3)).toBe("G2");
    expect(transposePitch("B3", 1)).toBe("C4");
