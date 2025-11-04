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

    expect(xml).toMatch(/<note time="0\.000" string="0" fret="0"/);
    expect(xml).toMatch(/<note time="1\.000" string="5" fret="0"/);
  });

  it("emits a 4-string tuning block for bass tracks", () => {
    const track = makeBassTrack([makeEvent("a", 0, 4, 0, "E1")]);
    const xml = trackToRocksmithXml(track);

    expect(xml).toMatch(/<tuning string0="0" string1="0" string2="0" string3="0" \/>/);
    expect(xml).toContain("<arrangement>Bass</arrangement>");
  });

  it("infers average tempo from event onsets", () => {
    // 0.5s spacing = 120 BPM
    const events = Array.from({ length: 8 }, (_, index) =>
      makeEvent(`n${index}`, index * 0.5, 6, 0)
    );

    const xml = trackToRocksmithXml(makeGuitarTrack(events));

    expect(xml).toMatch(/<averageTempo>120\.000<\/averageTempo>/);
  });

  it("produces an ebeat grid aligned to the inferred tempo", () => {
    const events = Array.from({ length: 8 }, (_, index) =>
      makeEvent(`n${index}`, index * 0.5, 6, 0)
    );

    const xml = trackToRocksmithXml(makeGuitarTrack(events), { durationSeconds: 4 });
    const ebeatMatches = xml.match(/<ebeat time="[^"]+"/g) ?? [];

    expect(ebeatMatches.length).toBeGreaterThanOrEqual(8);
  });

  it("omits albumYear when not provided and emits it when supplied", () => {
    const track = makeGuitarTrack([makeEvent("a", 0, 6, 0)]);

    const withoutYear = trackToRocksmithXml(track);
    expect(withoutYear).not.toContain("<albumYear>");

    const withYear = trackToRocksmithXml(track, { metadata: { albumYear: 2004 } });
    expect(withYear).toContain("<albumYear>2004</albumYear>");
  });

  it("escapes XML-unsafe characters in metadata", () => {
    const track = makeGuitarTrack([makeEvent("a", 0, 6, 0)]);
    const xml = trackToRocksmithXml(track, {
      metadata: { title: "Rock & Roll <Live>", artistName: "A \"Name\"" },
    });

    expect(xml).toContain("Rock &amp; Roll &lt;Live&gt;");
    expect(xml).toContain("A &quot;Name&quot;");
  });
});
