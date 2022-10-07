import { describe, expect, it } from "vitest";
import { standardBassTuning, standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import { trackToAsciiTab } from "./trackToAsciiTab";

function makeEvent(
  id: string,
  startSeconds: number,
  positions: { stringNumber: number; fret: number }[]
): TabEvent {
  return {
    id,
    startSeconds,
    durationSeconds: 0.25,
    kind: "single",
    texture: "mono",
    detectedPitches: [],
    chosenPositions: positions.map((position) => ({
      stringNumber: position.stringNumber,
      fret: position.fret,
      pitch: "",
    })),
    candidates: [],
    confidence: 1,
    locked: false,
  };
}

function makeBassTrack(events: TabEvent[]): TabTrack {
  return {
    id: "track-1",
    stemId: "stem-1",
    name: "Bass",
    instrument: "bass",
    tuning: standardBassTuning,
    events,
  };
}

function makeGuitarTrack(events: TabEvent[]): TabTrack {
  return {
    id: "track-1",
    stemId: "stem-1",
    name: "Guitar",
    instrument: "guitar",
    tuning: standardGuitarTuning,
    events,
  };
}

describe("trackToAsciiTab", () => {
  it("renders the highest string at the top", () => {
    const track = makeBassTrack([]);
    const ascii = trackToAsciiTab(track, 8, { lineDurationSeconds: 8, columnsPerLine: 16 });

    const rows = ascii.split("\n");
    expect(rows[0]).toBe("0:00");
    expect(rows[1].startsWith("G|")).toBe(true);
    expect(rows[2].startsWith("D|")).toBe(true);
    expect(rows[3].startsWith("A|")).toBe(true);
    expect(rows[4].startsWith("E|")).toBe(true);
  });

  it("places fret digits at the correct column for the line", () => {
    const events = [
      makeEvent("a", 0, [{ stringNumber: 4, fret: 3 }]),
      makeEvent("b", 4, [{ stringNumber: 2, fret: 5 }]),
    ];
    const track = makeBassTrack(events);
    const ascii = trackToAsciiTab(track, 8, { lineDurationSeconds: 8, columnsPerLine: 16 });

    const rows = ascii.split("\n");
    const eRow = rows.find((row) => row.startsWith("E|")) ?? "";
