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
          pitch: "E3",
          startSeconds: 1.25,
        },
      ],
      standardGuitarTuning,
      { createId: () => "suggested-1" }
    );

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      id: "suggested-1",
      startSeconds: 1.25,
      durationSeconds: 0.5,
      kind: "single",
      texture: "mono",
      detectedPitches: [{ pitch: "E3", confidence: 0.82, frequencyHz: 164.81 }],
