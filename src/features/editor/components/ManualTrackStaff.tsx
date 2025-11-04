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
            +25ms
          </button>
          <button type="button" onClick={() => onAnalyzeTrack(track.id)}>
            Analyze
          </button>
        </div>
      </div>
      <div
        className={styles.linesScroller}
        ref={linesScrollerRef}
        onClick={() => onClearSelectedEvent()}
      >
        {lines.map((line) => {
          const isActive = line.lineIndex === activeLineIndex;
          const lineEvents = getEventsForLine(track.events, line);
          const popoverEvent =
            selectedEventForTrack && selectedLineIndex === line.lineIndex
              ? selectedEventForTrack
              : undefined;

          return (
            <TabStaffLine
              key={line.lineIndex}
              isActive={isActive}
              lineRef={isActive ? activeLineRef : undefined}
              currentTime={currentTime}
              line={line}
              lineEvents={lineEvents}
              onAddNote={onAddNote}
              onClearSelectedEvent={onClearSelectedEvent}
              onDeleteSelectedEvent={onDeleteSelectedEvent}
              onSelectEvent={onSelectEvent}
              onUpdateSelectedEvent={onUpdateSelectedEvent}
              popoverEvent={popoverEvent}
              selectedEvent={selectedEvent}
              track={track}
            />
          );
        })}
      </div>
    </article>
  );
}

interface TabStaffLineProps {
  currentTime: number;
  isActive: boolean;
  line: TabLine;
  lineEvents: TabEvent[];
  lineRef?: React.Ref<HTMLDivElement>;
  onAddNote: (trackId: string, stringNumber: number, startSeconds: number) => void;
  onClearSelectedEvent: () => void;
  onDeleteSelectedEvent: () => void;
  onSelectEvent: (selection: SelectedTabEvent) => void;
  onUpdateSelectedEvent: (patch: EventPopoverPatch) => void;
  popoverEvent?: TabEvent;
  selectedEvent?: SelectedTabEvent;
  track: TabTrack;
}

function TabStaffLine({
  currentTime,
  isActive,
  line,
  lineEvents,
  lineRef,
  onAddNote,
  onClearSelectedEvent,
  onDeleteSelectedEvent,
  onSelectEvent,
  onUpdateSelectedEvent,
  popoverEvent,
  selectedEvent,
  track,
}: TabStaffLineProps) {
  const playheadPercent = getLineRelativePercent(currentTime, line);
  const popoverAnchorPercent = popoverEvent
    ? getLineRelativePercent(popoverEvent.startSeconds, line)
    : 50;

  return (
    <div
      className={isActive ? styles.tabLineActive : styles.tabLine}
      data-line-index={line.lineIndex}
      onClick={(clickEvent) => clickEvent.stopPropagation()}
      ref={lineRef}
    >
      <div className={styles.lineMeta}>
        <span className={styles.lineTime}>{formatLineTime(line.startSeconds)}</span>
      </div>
      <div className={styles.staffRows}>
        {track.tuning.strings.map((string, stringIndex) => {
          const isLastString = stringIndex === track.tuning.strings.length - 1;
          const eventsForString = lineEvents.filter((event) =>
            event.chosenPositions.some((position) => position.stringNumber === string.stringNumber)
          );

          return (
            <div className={styles.stringRow} key={string.stringNumber}>
              <span className={styles.stringLabel}>{string.openPitch}</span>
              <div
                className={styles.stringLine}
                data-tab-line="true"
                onClick={(clickEvent) => {
                  const target = clickEvent.currentTarget as HTMLDivElement;
                  const rect = target.getBoundingClientRect();
                  const ratio =
                    rect.width > 0
                      ? Math.min(
                          1,
                          Math.max(0, (clickEvent.clientX - rect.left) / rect.width)
                        )
                      : 0;
                  const startSeconds = line.startSeconds + ratio * line.durationSeconds;
                  onAddNote(track.id, string.stringNumber, startSeconds);
                }}
              >
                {isActive && (
                  <i className={styles.playhead} style={{ left: `${playheadPercent}%` }} />
                )}
                {eventsForString.map((event) => {
                  const position = event.chosenPositions.find(
                    (entry) => entry.stringNumber === string.stringNumber
                  );

                  if (!position) {
                    return null;
                  }

                  const isSelected = selectedEvent?.eventId === event.id;
                  return (
                    <button
                      className={isSelected ? styles.selectedNote : styles.note}
                      key={`${event.id}-${position.stringNumber}`}
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation();
                        onSelectEvent({ eventId: event.id, trackId: track.id });
                      }}
                      style={getNoteStyle(getLineRelativePercent(event.startSeconds, line))}
                      title={`${event.startSeconds.toFixed(2)}s`}
                      type="button"
                    >
                      {position.fret}
                    </button>
                  );
                })}
                {isLastString && popoverEvent && (
                  <EventPopover
                    anchorPercent={clampPopoverAnchor(popoverAnchorPercent)}
                    event={popoverEvent}
                    onClose={onClearSelectedEvent}
                    onDelete={onDeleteSelectedEvent}
                    onUpdate={onUpdateSelectedEvent}
                    track={track}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function clampPopoverAnchor(percent: number): number {
  return Math.min(96, Math.max(4, percent));
}

function formatLineTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getNoteStyle(linePercent: number): CSSProperties {
  return { "--note-offset": `${linePercent}%` } as CSSProperties;
}
