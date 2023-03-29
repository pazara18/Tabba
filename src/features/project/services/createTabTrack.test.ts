import { describe, expect, it } from "vitest";
import { standardBassTuning, standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import { createTabTrack } from "./createTabTrack";

describe("createTabTrack", () => {
  it("creates a standard guitar tab track for a stem", () => {
    const track = createTabTrack({
      createId: () => "track-1",
      instrument: "guitar",
