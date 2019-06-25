import { describe, expect, it } from "vitest";
import { standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import { createSuggestedTabEvents } from "./createSuggestedTabEvents";

describe("createSuggestedTabEvents", () => {
  it("creates unlocked editable tab suggestions from detected notes", () => {
    const events = createSuggestedTabEvents(
      [
        {
          confidence: 0.82,
          durationSeconds: 0.5,
          frequencyHz: 164.81,
