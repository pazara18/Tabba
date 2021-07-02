import { useEffect, useRef, type CSSProperties } from "react";
import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import {
  createTabLines,
  getActiveLineIndex,
  getEventsForLine,
  getLineRelativePercent,
  type TabLine,
} from "../services/tabLineLayout";
import type { SelectedTabEvent } from "../types";
import { EventPopover, type EventPopoverPatch } from "./EventPopover";
import styles from "./ManualTrackStaff.module.css";

interface ManualTrackStaffProps {
  currentTime: number;
  duration: number;
  onAddNote: (trackId: string, stringNumber: number, startSeconds: number) => void;
  onAnalyzeTrack: (trackId: string) => void;
  onClearSelectedEvent: () => void;
  onDeleteSelectedEvent: () => void;
  onSelectEvent: (selection: SelectedTabEvent) => void;
  onShiftSuggestions: (trackId: string, deltaSeconds: number) => void;
  onUpdateSelectedEvent: (patch: EventPopoverPatch) => void;
  selectedEvent?: SelectedTabEvent;
  track: TabTrack;
}

export function ManualTrackStaff({
  currentTime,
  duration,
  onAddNote,
  onAnalyzeTrack,
  onClearSelectedEvent,
  onDeleteSelectedEvent,
  onSelectEvent,
  onShiftSuggestions,
  onUpdateSelectedEvent,
  selectedEvent,
  track,
}: ManualTrackStaffProps) {
  const linesScrollerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const lines = createTabLines(duration);
  const activeLineIndex = getActiveLineIndex(currentTime, lines);

  const selectedEventForTrack =
    selectedEvent && selectedEvent.trackId === track.id
      ? track.events.find((event) => event.id === selectedEvent.eventId)
