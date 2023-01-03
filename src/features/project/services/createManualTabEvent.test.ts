import { describe, expect, it } from "vitest";
import { standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import { createManualTabEvent } from "./createManualTabEvent";

describe("createManualTabEvent", () => {
  it("creates a locked single-note event from a string and fret", () => {
    const event = createManualTabEvent({
      createId: () => "event-1",
      fret: 2,
      startSeconds: 12.5,
      stringNumber: 4,
      tuning: standardGuitarTuning,
    });

    expect(event).toMatchObject({
      id: "event-1",
      startSeconds: 12.5,
      durationSeconds: 1,
