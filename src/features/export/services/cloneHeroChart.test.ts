import { describe, expect, it } from "vitest";
import { standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import { inferBpmForTrack, trackToCloneHeroChart } from "./cloneHeroChart";

function makeEvent(
  id: string,
  startSeconds: number,
  pitch: string,
  durationSeconds = 0.25
): TabEvent {
  return {
    id,
    startSeconds,
    durationSeconds,
    kind: "single",
    texture: "mono",
    detectedPitches: [],
    chosenPositions: [{ stringNumber: 1, fret: 0, pitch }],
    candidates: [],
    confidence: 1,
    locked: false,
  };
}

function makeTrack(events: TabEvent[]): TabTrack {
  return {
    id: "track-1",
    stemId: "stem-1",
    name: "Lead",
    instrument: "guitar",
    tuning: standardGuitarTuning,
    events,
  };
}

describe("trackToCloneHeroChart", () => {
  it("emits the required chart sections", () => {
    const track = makeTrack([
      makeEvent("a", 0, "E2"),
      makeEvent("b", 0.5, "A3"),
      makeEvent("c", 1, "E4"),
      makeEvent("d", 1.5, "B3"),
    ]);

    const chart = trackToCloneHeroChart(track, { bpm: 120 });

    expect(chart).toContain("[Song]");
    expect(chart).toContain("[SyncTrack]");
    expect(chart).toContain("[Events]");
    expect(chart).toContain("[ExpertSingle]");
    expect(chart).toMatch(/Resolution = 192/);
    expect(chart).toMatch(/B 120000/);
  });

  it("converts seconds to ticks using bpm and resolution", () => {
    const track = makeTrack([
      makeEvent("a", 0, "E2"),
      makeEvent("b", 0.5, "A3"),
      makeEvent("c", 1, "E4"),
      makeEvent("d", 1.5, "B3"),
    ]);

    // At 120 BPM and resolution 192, one second = 2 beats = 384 ticks.
    const chart = trackToCloneHeroChart(track, { bpm: 120, resolution: 192 });

