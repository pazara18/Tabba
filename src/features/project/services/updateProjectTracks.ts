import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack, TabbaProject } from "../types";
import { createManualTabPosition } from "./createManualTabEvent";
import { createPositionCandidates } from "../../../domain/fingering/fretboardCandidates";

interface ManualEventPatch {
  durationSeconds?: number;
  fret?: number;
  startSeconds?: number;
  stringNumber?: number;
}

export function addTrackToProject(
  project: TabbaProject,
  track: TabTrack,
  updatedAt: Date
): TabbaProject {
  return {
    ...project,
    tracks: [...project.tracks, track],
    updatedAt: updatedAt.toISOString(),
  };
}

export function addEventToTrack(
  project: TabbaProject,
  trackId: string,
  event: TabEvent,
  updatedAt: Date
): TabbaProject {
  return {
    ...project,
    tracks: project.tracks.map((track) =>
      track.id === trackId
        ? { ...track, events: sortEventsByStart([...track.events, event]) }
        : track
    ),
    updatedAt: updatedAt.toISOString(),
  };
}

export function addEventsToTrack(
  project: TabbaProject,
  trackId: string,
  events: TabEvent[],
  updatedAt: Date
): TabbaProject {
  return updateTrackEvents(project, trackId, updatedAt, (track) =>
    sortEventsByStart([...track.events, ...events])
  );
}

export function replaceSuggestedEventsInTrack(
  project: TabbaProject,
