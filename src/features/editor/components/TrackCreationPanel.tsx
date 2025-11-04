import type { InstrumentKind } from "../../../domain/instruments/types";
import styles from "./TrackCreationPanel.module.css";

interface TrackCreationPanelProps {
  onCreateTrack: (instrument: InstrumentKind) => void;
}

export function TrackCreationPanel({ onCreateTrack }: TrackCreationPanelProps) {
  return (
    <div className={styles.creationPanel}>
      <button type="button" onClick={() => onCreateTrack("guitar")}>
        + Guitar
      </button>
      <button type="button" onClick={() => onCreateTrack("bass")}>
        + Bass
      </button>
    </div>
  );
}
