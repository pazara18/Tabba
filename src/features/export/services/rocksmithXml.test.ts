import { describe, expect, it } from "vitest";
import { standardBassTuning, standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import { trackToRocksmithXml } from "./rocksmithXml";

function makeEvent(
  id: string,
  startSeconds: number,
  stringNumber: number,
  fret: number,
  pitch = "E2",
  durationSeconds = 0.25
): TabEvent {
  return {
    id,
    startSeconds,
    durationSeconds,
    kind: "single",
    texture: "mono",
    detectedPitches: [],
    chosenPositions: [{ stringNumber, fret, pitch }],
    candidates: [],
    confidence: 1,
    locked: false,
  };
}

function makeGuitarTrack(events: TabEvent[]): TabTrack {
  return {
    id: "track-guitar",
    stemId: "stem-1",
    name: "Lead",
    instrument: "guitar",
    tuning: standardGuitarTuning,
    events,
  };
}

function makeBassTrack(events: TabEvent[]): TabTrack {
  return {
    id: "track-bass",
    stemId: "stem-1",
    name: "Bass",
    instrument: "bass",
    tuning: standardBassTuning,
    events,
  };
}

describe("trackToRocksmithXml", () => {
  it("emits valid song XML with the required top-level elements", () => {
    const track = makeGuitarTrack([makeEvent("a", 0, 6, 0, "E2")]);
    const xml = trackToRocksmithXml(track, { durationSeconds: 5 });

