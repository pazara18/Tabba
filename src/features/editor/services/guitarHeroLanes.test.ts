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
    expect(bucketMidiToLane(40, 40, 80)).toBe(0);
    expect(bucketMidiToLane(80, 40, 80)).toBe(GH_LANE_COUNT - 1);
  });

  it("distributes evenly across lanes", () => {
    const buckets = [40, 48, 56, 64, 72, 80].map((pitch) => bucketMidiToLane(pitch, 40, 80));
    expect(buckets).toEqual([0, 1, 2, 3, 4, 4]);
  });
});

describe("eventsToGhTrack", () => {
  it("returns an empty track when there are no events with pitches", () => {
    const track = eventsToGhTrack([]);
    expect(track.notes).toHaveLength(0);
    expect(track.pitchRange).toBeUndefined();
  });

  it("assigns lane 0 to the lowest pitch and lane 4 to the highest", () => {
    const events = [
      makeEvent("a", 0, [{ pitch: "E2" }]),
      makeEvent("b", 1, [{ pitch: "E4" }]),
      makeEvent("c", 2, [{ pitch: "A3" }]),
    ];

    const track = eventsToGhTrack(events);
    const laneByEvent = new Map(track.notes.map((note) => [note.eventId, note.lane]));

    expect(laneByEvent.get("a")).toBe(0);
    expect(laneByEvent.get("b")).toBe(GH_LANE_COUNT - 1);
    expect(laneByEvent.get("c")).toBeGreaterThan(0);
    expect(laneByEvent.get("c")).toBeLessThan(GH_LANE_COUNT - 1);
  });

  it("emits one note per distinct lane for a chord event", () => {
    const events = [
