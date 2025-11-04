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

    expect(chart).toMatch(/^\s*0 = N \d+ \d+/m);
    expect(chart).toMatch(/^\s*192 = N \d+ \d+/m);
    expect(chart).toMatch(/^\s*384 = N \d+ \d+/m);
    expect(chart).toMatch(/^\s*576 = N \d+ \d+/m);
  });

  it("infers BPM from onsets when no override is provided", () => {
    const track = makeTrack(
      Array.from({ length: 8 }, (_, index) => makeEvent(`n${index}`, index * 0.5, "E2"))
    );

    const bpm = inferBpmForTrack(track);

    // 0.5s beats = 120 BPM.
    expect(bpm).toBeCloseTo(120, 1);
  });

  it("skips events without valid pitches", () => {
    const events = [
      makeEvent("a", 0, "E2"),
      makeEvent("b", 0.5, ""),
      makeEvent("c", 1, "not-a-pitch"),
      makeEvent("d", 1.5, "A3"),
    ];
    const track = makeTrack(events);

    const chart = trackToCloneHeroChart(track, { bpm: 120 });
    const noteLines = chart.split("\n").filter((line) => /^\s*\d+ = N /.test(line));

    expect(noteLines).toHaveLength(2);
  });
});
