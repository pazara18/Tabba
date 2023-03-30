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
      name: "Guitar tab",
      instrument: "guitar",
      tuning: standardGuitarTuning,
      events: [],
    });
  });

  it("creates a standard bass tab track for a stem", () => {
    const track = createTabTrack({
      createId: () => "track-2",
      instrument: "bass",
      stemId: "stem-1",
    });

    expect(track.tuning).toBe(standardBassTuning);
    expect(track.name).toBe("Bass tab");
  });
