import { describe, expect, it } from "vitest";
import { createManualTabEvent } from "./createManualTabEvent";
import { createProjectFixture } from "../../../test/fixtures/createProjectFixture";
import { createTabTrack } from "./createTabTrack";
import {
  addEventToTrack,
  addEventsToTrack,
  addTrackToProject,
  deleteEventFromTrack,
  replaceSuggestedEventsInTrack,
  shiftSuggestedEventsInTrack,
  updateManualEvent,
} from "./updateProjectTracks";

describe("updateProjectTracks", () => {
  it("adds a track without mutating the original project", () => {
    const project = { ...createProjectFixture(), tracks: [] };
    const track = createTabTrack({
      createId: () => "track-2",
      instrument: "bass",
      stemId: "stem-1",
    });

    const updated = addTrackToProject(project, track, new Date("2026-04-15T16:00:00.000Z"));

    expect(project.tracks).toEqual([]);
    expect(updated.tracks).toEqual([track]);
    expect(updated.updatedAt).toBe("2026-04-15T16:00:00.000Z");
  });

  it("adds events to a track in timeline order", () => {
    const project = createProjectFixture();
    const track = project.tracks[0];
    const lateEvent = createManualTabEvent({
      createId: () => "event-late",
      fret: 3,
      startSeconds: 8,
      stringNumber: 1,
      tuning: track.tuning,
    });
    const earlyEvent = createManualTabEvent({
      createId: () => "event-early",
      fret: 5,
      startSeconds: 2,
      stringNumber: 2,
      tuning: track.tuning,
    });

    const withLate = addEventToTrack(project, track.id, lateEvent, new Date());
    const withBoth = addEventToTrack(withLate, track.id, earlyEvent, new Date());

    expect(withBoth.tracks[0].events.map((event) => event.id)).toEqual([
      "event-1",
      "event-early",
      "event-late",
    ]);
  });

  it("adds multiple events to a track in timeline order", () => {
    const project = createProjectFixture();
    const track = project.tracks[0];
