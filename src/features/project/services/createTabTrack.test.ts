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

  it("creates an id with the runtime default id generator", () => {
    const track = createTabTrack({ instrument: "guitar", stemId: "stem-1" });

    expect(track.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });
});
