import { useEffect, useRef, type CSSProperties } from "react";
import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import styles from "./EventPopover.module.css";

export interface EventPopoverPatch {
  durationSeconds?: number;
  fret?: number;
  startSeconds?: number;
  stringNumber?: number;
}

interface EventPopoverProps {
  anchorPercent: number;
  event: TabEvent;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: (patch: EventPopoverPatch) => void;
  track: TabTrack;
}

export function EventPopover({
  anchorPercent,
  event,
  onClose,
  onDelete,
  onUpdate,
  track,
}: EventPopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const position = event.chosenPositions[0];

  useEffect(() => {
    function handleKey(downEvent: KeyboardEvent) {
      if (downEvent.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!position) {
    return null;
  }

  const popoverStyle = { "--anchor-percent": `${anchorPercent}%` } as CSSProperties;
  const chordPositions = event.chosenPositions;
  const isChord = chordPositions.length > 1;

  return (
    <div
      className={styles.popover}
      onClick={(clickEvent) => clickEvent.stopPropagation()}
      ref={popoverRef}
      role="dialog"
      style={popoverStyle}
    >
      <div className={styles.arrow} />
      <header className={styles.header}>
        <div>
          <span className={styles.kind}>{event.kind}</span>
          <span className={styles.texture}>{event.texture}</span>
        </div>
        <button
          aria-label="Close inspector"
          className={styles.closeButton}
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </header>
      <dl className={styles.metrics}>
        <div>
          <dt>Start</dt>
          <dd>{event.startSeconds.toFixed(3)}s</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{event.durationSeconds.toFixed(3)}s</dd>
        </div>
        <div>
          <dt>Confidence</dt>
          <dd>{(event.confidence * 100).toFixed(0)}%</dd>
        </div>
      </dl>
      <form className={styles.editor} onSubmit={(submitEvent) => submitEvent.preventDefault()}>
        <label>
          String
          <select
            onChange={(changeEvent) =>
              onUpdate({ stringNumber: Number(changeEvent.currentTarget.value) })
            }
            value={position.stringNumber}
          >
            {track.tuning.strings.map((string) => (
              <option key={string.stringNumber} value={string.stringNumber}>
                {string.stringNumber} – {string.openPitch}
              </option>
            ))}
          </select>
        </label>
        <label>
          Fret
          <input
            min={0}
            onChange={(changeEvent) =>
              onUpdate({ fret: Number(changeEvent.currentTarget.value) })
            }
            type="number"
            value={position.fret}
          />
        </label>
        <label>
          Start
          <input
            min={0}
            onChange={(changeEvent) =>
              onUpdate({ startSeconds: Number(changeEvent.currentTarget.value) })
            }
            step={0.05}
            type="number"
            value={event.startSeconds}
          />
        </label>
        <label>
          Duration
          <input
            min={0.05}
            onChange={(changeEvent) =>
              onUpdate({ durationSeconds: Number(changeEvent.currentTarget.value) })
            }
            step={0.05}
            type="number"
            value={event.durationSeconds}
          />
        </label>
      </form>
      {isChord && (
        <section className={styles.chordSection}>
          <h4>Chord</h4>
          <ul className={styles.chordList}>
            {chordPositions.map((chordPosition) => (
              <li key={`${chordPosition.stringNumber}-${chordPosition.fret}`}>
                <span>String {chordPosition.stringNumber}</span>
                <strong>{chordPosition.fret}</strong>
                <small>{chordPosition.pitch || "—"}</small>
              </li>
            ))}
          </ul>
        </section>
      )}
      {event.candidates.length > 0 && (
        <section className={styles.candidates}>
          <h4>Alternate positions</h4>
