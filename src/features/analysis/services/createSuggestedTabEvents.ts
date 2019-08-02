import { createPositionCandidates } from "../../../domain/fingering/fretboardCandidates";
import type { InstrumentTuning } from "../../../domain/instruments/types";
import type { TabEvent, TabPosition } from "../../../domain/tab/types";
import type { DetectedNote } from "../types";

interface SuggestedEventOptions {
  createId?: () => string;
  lockedEvents?: TabEvent[];
}

const defaultCreateId = () => crypto.randomUUID();

export function createSuggestedTabEvents(
  notes: DetectedNote[],
  tuning: InstrumentTuning,
  options: SuggestedEventOptions = {}
): TabEvent[] {
  const createId = options.createId ?? defaultCreateId;
  const lockedEvents = sortEventsByStart(options.lockedEvents ?? []);
  const createdEvents: TabEvent[] = [];
  let lockedEventIndex = 0;
  let previousPosition: TabPosition | undefined;
  let previousPositionStartSeconds = -Infinity;

  for (const note of [...notes].sort((left, right) => left.startSeconds - right.startSeconds)) {
    while (
      lockedEventIndex < lockedEvents.length &&
      lockedEvents[lockedEventIndex].startSeconds < note.startSeconds
    ) {
      const lockedEvent = lockedEvents[lockedEventIndex];
      const lockedPosition = lockedEvent.chosenPositions[0];

      if (lockedPosition && lockedEvent.startSeconds >= previousPositionStartSeconds) {
        previousPosition = lockedPosition;
        previousPositionStartSeconds = lockedEvent.startSeconds;
      }

      lockedEventIndex += 1;
    }

    const candidates = createPositionCandidates(note.pitch, tuning, { previousPosition });
    const chosenPosition = candidates[0]?.positions[0];
