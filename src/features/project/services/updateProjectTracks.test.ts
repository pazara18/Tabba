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
