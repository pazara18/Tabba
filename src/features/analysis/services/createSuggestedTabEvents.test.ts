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
      chosenPositions: [{ stringNumber: 4, fret: 2, pitch: "E3" }],
      confidence: 0.82,
      locked: false,
    });
    expect(events[0].candidates.length).toBeGreaterThan(1);
  });

  it("skips notes that cannot be played on the tuning", () => {
    expect(
      createSuggestedTabEvents(
        [
          {
            confidence: 0.9,
            durationSeconds: 0.5,
            frequencyHz: 32.7,
            pitch: "C1",
            startSeconds: 0,
          },
        ],
        standardGuitarTuning
      )
    ).toEqual([]);
  });

  it("uses locked earlier positions as fingering context", () => {
    const [event] = createSuggestedTabEvents(
      [
        {
          confidence: 0.82,
          durationSeconds: 0.5,
          frequencyHz: 329.63,
          pitch: "E4",
          startSeconds: 2,
        },
      ],
      standardGuitarTuning,
      {
        createId: () => "suggested-1",
        lockedEvents: [
          {
            id: "locked-1",
            startSeconds: 1,
            durationSeconds: 0.5,
            kind: "single",
            texture: "mono",
            detectedPitches: [],
            chosenPositions: [{ stringNumber: 2, fret: 5, pitch: "E4" }],
            candidates: [],
            confidence: 1,
            locked: true,
          },
        ],
      }
    );

    expect(event.chosenPositions).toEqual([{ stringNumber: 2, fret: 5, pitch: "E4" }]);
  });

  it("uses the nearest earlier locked position when locked events are unsorted", () => {
    const [event] = createSuggestedTabEvents(
