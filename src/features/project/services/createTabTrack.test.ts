import { describe, expect, it } from "vitest";
import { standardBassTuning, standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import { createTabTrack } from "./createTabTrack";

describe("createTabTrack", () => {
  it("creates a standard guitar tab track for a stem", () => {
    const track = createTabTrack({
      createId: () => "track-1",
      instrument: "guitar",
      stemId: "stem-1",
    });

    expect(track).toEqual({
      id: "track-1",
      stemId: "stem-1",
