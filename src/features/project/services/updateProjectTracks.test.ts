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
    const eventA = createManualTabEvent({
      createId: () => "event-a",
      fret: 3,
      startSeconds: 8,
      stringNumber: 1,
      tuning: track.tuning,
    });
    const eventB = createManualTabEvent({
      createId: () => "event-b",
      fret: 5,
      startSeconds: 2,
      stringNumber: 2,
      tuning: track.tuning,
    });

    const updated = addEventsToTrack(project, track.id, [eventA, eventB], new Date());

    expect(updated.tracks[0].events.map((event) => event.id)).toEqual([
      "event-1",
      "event-b",
      "event-a",
    ]);
  });

  it("replaces previous unlocked suggestions while preserving locked edits", () => {
    const project = lockFixtureEvents(createProjectFixture());
    const track = project.tracks[0];
    const previousSuggestion = {
      ...createManualTabEvent({
        createId: () => "suggested-old",
        fret: 3,
        startSeconds: 3,
        stringNumber: 5,
        tuning: track.tuning,
      }),
      locked: false,
    };
    const nextSuggestion = {
      ...createManualTabEvent({
        createId: () => "suggested-new",
        fret: 5,
        startSeconds: 5,
        stringNumber: 5,
        tuning: track.tuning,
      }),
      locked: false,
    };
    const projectWithSuggestion = addEventToTrack(project, track.id, previousSuggestion, new Date());

    const updated = replaceSuggestedEventsInTrack(
      projectWithSuggestion,
      track.id,
      [nextSuggestion],
      new Date()
    );

    expect(updated.tracks[0].events.map((event) => event.id)).toEqual([
      "event-1",
      "suggested-new",
    ]);
  });

  it("does not add new suggestions that overlap locked edits", () => {
    const project = lockFixtureEvents(createProjectFixture());
    const track = project.tracks[0];
    const overlappingSuggestion = {
      ...createManualTabEvent({
        createId: () => "suggested-overlap",
        durationSeconds: 0.5,
        fret: 3,
        startSeconds: 1.2,
        stringNumber: 5,
        tuning: track.tuning,
      }),
      locked: false,
    };
    const laterSuggestion = {
      ...createManualTabEvent({
        createId: () => "suggested-later",
        fret: 5,
        startSeconds: 5,
        stringNumber: 5,
        tuning: track.tuning,
      }),
      locked: false,
    };

    const updated = replaceSuggestedEventsInTrack(
      project,
