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
  trackId: string,
  suggestedEvents: TabEvent[],
  updatedAt: Date
): TabbaProject {
  return updateTrackEvents(project, trackId, updatedAt, (track) => {
    const lockedEvents = track.events.filter((event) => event.locked);
    const nonOverlappingSuggestions = suggestedEvents.filter(
      (event) => !lockedEvents.some((lockedEvent) => eventsOverlap(event, lockedEvent))
    );

    return sortEventsByStart([...lockedEvents, ...nonOverlappingSuggestions]);
  });
}

export function shiftSuggestedEventsInTrack(
  project: TabbaProject,
  trackId: string,
  deltaSeconds: number,
  updatedAt: Date
): TabbaProject {
  return updateTrackEvents(project, trackId, updatedAt, (track) =>
    sortEventsByStart(
      track.events.map((event) =>
        event.locked
          ? event
          : { ...event, startSeconds: Math.max(0, event.startSeconds + deltaSeconds) }
      )
    )
  );
}

export function updateManualEvent(
  project: TabbaProject,
  trackId: string,
  eventId: string,
  patch: ManualEventPatch,
  updatedAt: Date
): TabbaProject {
  return updateTrackEvents(project, trackId, updatedAt, (track) =>
    sortEventsByStart(
      track.events.map((event) =>
        event.id === eventId ? applyManualEventPatch(track, event, patch) : event
      )
    )
  );
}

export function deleteEventFromTrack(
  project: TabbaProject,
  trackId: string,
  eventId: string,
  updatedAt: Date
): TabbaProject {
  return updateTrackEvents(project, trackId, updatedAt, (track) =>
    track.events.filter((event) => event.id !== eventId)
  );
}

function applyManualEventPatch(
  track: TabTrack,
  event: TabEvent,
  patch: ManualEventPatch
): TabEvent {
  const currentPosition = event.chosenPositions[0];
  const stringNumber = patch.stringNumber ?? currentPosition?.stringNumber;
  const fret = patch.fret ?? currentPosition?.fret;

  if (stringNumber === undefined || fret === undefined) {
    return event;
  }

  const nextPosition = createManualTabPosition(track.tuning, stringNumber, fret);

  return {
    ...event,
    startSeconds: patch.startSeconds ?? event.startSeconds,
    durationSeconds: patch.durationSeconds ?? event.durationSeconds,
