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
      : undefined;
  const selectedLineIndex = selectedEventForTrack
    ? lines.find(
        (line) =>
          selectedEventForTrack.startSeconds >= line.startSeconds &&
          selectedEventForTrack.startSeconds < line.endSeconds
      )?.lineIndex ?? lines[lines.length - 1]?.lineIndex
    : undefined;

  useEffect(() => {
    const scroller = linesScrollerRef.current;
    const activeLine = activeLineRef.current;

    if (!scroller || !activeLine) {
      return;
    }

    const lineTop = activeLine.offsetTop;
    const lineBottom = lineTop + activeLine.clientHeight;
    const viewportTop = scroller.scrollTop;
    const viewportBottom = viewportTop + scroller.clientHeight;
    const padding = scroller.clientHeight * 0.18;

    if (lineTop < viewportTop + padding) {
      scroller.scrollTo({ top: Math.max(0, lineTop - padding), behavior: "smooth" });
    } else if (lineBottom > viewportBottom - padding) {
      scroller.scrollTo({
        top: Math.max(0, lineBottom - scroller.clientHeight + padding),
        behavior: "smooth",
      });
    }
  }, [activeLineIndex]);

  return (
    <article className={styles.trackStaff} aria-label={`${track.name} staff`}>
      <div className={styles.trackHeader}>
        <div>
          <h3>{track.name}</h3>
          <span>{track.events.length} events</span>
        </div>
        <div className={styles.trackActions}>
          <button type="button" onClick={() => onShiftSuggestions(track.id, -0.025)}>
            -25ms
          </button>
          <button type="button" onClick={() => onShiftSuggestions(track.id, 0.025)}>
