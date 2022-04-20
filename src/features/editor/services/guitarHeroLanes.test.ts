import { describe, expect, it } from "vitest";
import type { TabEvent } from "../../../domain/tab/types";
import { bucketMidiToLane, eventsToGhTrack, GH_LANE_COUNT } from "./guitarHeroLanes";

function makeEvent(
  id: string,
  startSeconds: number,
  positions: { pitch: string; stringNumber?: number; fret?: number }[],
  durationSeconds = 0.25
): TabEvent {
  return {
    id,
    startSeconds,
    durationSeconds,
    kind: positions.length > 1 ? "chord" : "single",
    texture: positions.length > 1 ? "poly" : "mono",
    detectedPitches: [],
    chosenPositions: positions.map((position) => ({
      stringNumber: position.stringNumber ?? 1,
      fret: position.fret ?? 0,
      pitch: position.pitch,
    })),
    candidates: [],
    confidence: 1,
    locked: false,
  };
}

describe("bucketMidiToLane", () => {
  it("returns the middle lane when min equals max", () => {
    expect(bucketMidiToLane(60, 60, 60)).toBe(2);
  });

  it("maps the minimum pitch to lane 0 and the maximum to lane 4", () => {
