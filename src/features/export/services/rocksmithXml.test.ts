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

    expect(xml).toMatch(/^<\?xml version="1\.0" encoding="utf-8"\?>/);
    expect(xml).toContain("<song version=\"7\">");
    expect(xml).toContain("<title>Lead</title>");
    expect(xml).toContain("<arrangement>Lead</arrangement>");
    expect(xml).toContain("<songLength>5.000</songLength>");
  });

  it("converts our stringNumber (1=highest) to Rocksmith string (0=lowest)", () => {
    // stringNumber 6 (low E) -> rocksmith string 0
    const lowE = makeEvent("low", 0, 6, 0);
    // stringNumber 1 (high E) -> rocksmith string 5
    const highE = makeEvent("high", 1, 1, 0, "E4");

    const xml = trackToRocksmithXml(makeGuitarTrack([lowE, highE]));

