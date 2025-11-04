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
      track.id,
      [overlappingSuggestion, laterSuggestion],
      new Date()
    );

    expect(updated.tracks[0].events.map((event) => event.id)).toEqual([
      "event-1",
      "suggested-later",
    ]);
  });

  it("shifts unlocked suggestions while preserving locked events", () => {
    const project = lockFixtureEvents(createProjectFixture());
    const track = project.tracks[0];
    const suggestion = {
      ...createManualTabEvent({
        createId: () => "suggested",
        fret: 3,
        startSeconds: 3,
        stringNumber: 5,
        tuning: track.tuning,
      }),
      locked: false,
    };
    const projectWithSuggestion = addEventToTrack(project, track.id, suggestion, new Date());

    const updated = shiftSuggestedEventsInTrack(
      projectWithSuggestion,
      track.id,
      -0.25,
      new Date("2026-04-15T19:00:00.000Z")
    );

    expect(updated.tracks[0].events.map((event) => [event.id, event.startSeconds])).toEqual([
      ["event-1", 1],
      ["suggested", 2.75],
    ]);
    expect(updated.updatedAt).toBe("2026-04-15T19:00:00.000Z");
  });

  it("does not shift unlocked suggestions before zero", () => {
    const project = { ...createProjectFixture(), tracks: [] };
    const track = createTabTrack({
      createId: () => "track-1",
      instrument: "guitar",
      stemId: "stem-1",
    });
    const projectWithTrack = addTrackToProject(project, track, new Date());
    const suggestion = {
      ...createManualTabEvent({
        createId: () => "suggested",
        fret: 3,
        startSeconds: 0.1,
        stringNumber: 5,
        tuning: track.tuning,
      }),
      locked: false,
    };

    const updated = shiftSuggestedEventsInTrack(
      addEventToTrack(projectWithTrack, track.id, suggestion, new Date()),
      track.id,
      -0.25,
      new Date()
    );

    expect(updated.tracks[0].events[0].startSeconds).toBe(0);
  });

  it("leaves other tracks unchanged when adding an event", () => {
    const project = createProjectFixture();
    const track = project.tracks[0];
    const otherTrack = createTabTrack({
      createId: () => "track-other",
      instrument: "bass",
      stemId: "stem-1",
    });
    const projectWithOtherTrack = {
      ...project,
      tracks: [...project.tracks, otherTrack],
    };
    const event = createManualTabEvent({
      createId: () => "event-new",
      fret: 3,
      startSeconds: 8,
      stringNumber: 1,
      tuning: track.tuning,
    });

    const updated = addEventToTrack(projectWithOtherTrack, track.id, event, new Date());

    expect(updated.tracks[1]).toBe(otherTrack);
  });

  it("updates a manual event and recalculates its pitch", () => {
    const project = createProjectFixture();
    const track = project.tracks[0];

    const updated = updateManualEvent(
      project,
      track.id,
      "event-1",
      {
        durationSeconds: 0.75,
        fret: 3,
        startSeconds: 4,
        stringNumber: 5,
      },
      new Date("2026-04-15T17:00:00.000Z")
    );
    const event = updated.tracks[0].events[0];

    expect(event.startSeconds).toBe(4);
    expect(event.durationSeconds).toBe(0.75);
    expect(event.chosenPositions).toEqual([{ stringNumber: 5, fret: 3, pitch: "C3" }]);
    expect(event.candidates[0].positions).toEqual([
      { stringNumber: 5, fret: 3, pitch: "C3" },
    ]);
    expect(event.locked).toBe(true);
    expect(updated.updatedAt).toBe("2026-04-15T17:00:00.000Z");
  });

  it("keeps events sorted after changing start time", () => {
    const project = createProjectFixture();
    const track = project.tracks[0];
    const earlyEvent = createManualTabEvent({
      createId: () => "event-early",
      fret: 5,
      startSeconds: 2,
      stringNumber: 2,
      tuning: track.tuning,
    });
    const withBoth = addEventToTrack(project, track.id, earlyEvent, new Date());

    const updated = updateManualEvent(
      withBoth,
      track.id,
      "event-1",
      { startSeconds: 0.5 },
      new Date()
    );

    expect(updated.tracks[0].events.map((event) => event.id)).toEqual([
      "event-1",
      "event-early",
    ]);
  });

  it("deletes an event from a track", () => {
    const project = createProjectFixture();
    const track = project.tracks[0];

    const updated = deleteEventFromTrack(
      project,
      track.id,
      "event-1",
      new Date("2026-04-15T18:00:00.000Z")
    );

    expect(updated.tracks[0].events).toEqual([]);
    expect(updated.updatedAt).toBe("2026-04-15T18:00:00.000Z");
  });
});

function lockFixtureEvents(project: ReturnType<typeof createProjectFixture>) {
  return {
    ...project,
    tracks: project.tracks.map((track) => ({
      ...track,
      events: track.events.map((event) => ({ ...event, locked: true })),
    })),
  };
}
