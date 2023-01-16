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
      kind: "single",
      texture: "mono",
      detectedPitches: [],
      chosenPositions: [{ stringNumber: 4, fret: 2, pitch: "E3" }],
      confidence: 1,
      locked: true,
    });
    expect(event.candidates.map((candidate) => candidate.id)).toEqual([
      "single:4:2",
      "single:5:7",
      "single:6:12",
    ]);
  });

  it("supports custom duration", () => {
    const event = createManualTabEvent({
      createId: () => "event-2",
      durationSeconds: 0.25,
      fret: 0,
      startSeconds: 1,
      stringNumber: 1,
      tuning: standardGuitarTuning,
    });

    expect(event.durationSeconds).toBe(0.25);
    expect(event.chosenPositions[0].pitch).toBe("E4");
  });

  it("creates an id with the runtime default id generator", () => {
    const event = createManualTabEvent({
      fret: 0,
      startSeconds: 1,
      stringNumber: 1,
