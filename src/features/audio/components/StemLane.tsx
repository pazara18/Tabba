import { useId } from "react";
import type { Stem } from "../../project/types";
import { getStemMix, type StemMix } from "../services/stemMixState";
import styles from "./StemLane.module.css";

interface StemLaneProps {
  activeStemId?: string;
  mixStates: Record<string, StemMix>;
  onImportFiles: (files: FileList) => void;
  onSelectStem: (stemId: string) => void;
  onToggleMute: (stemId: string) => void;
  onToggleSolo: (stemId: string) => void;
  projectNotice?: string;
  stems: Stem[];
}

export function StemLane({
  activeStemId,
  mixStates,
  onImportFiles,
  onSelectStem,
  onToggleMute,
  onToggleSolo,
  projectNotice,
  stems,
}: StemLaneProps) {
  const inputId = useId();

  return (
    <section className={styles.stemLane} aria-label="Stem lane">
      <div className={styles.header}>
        <div>
          <h2>Stems</h2>
          <span>{stems.length}</span>
        </div>
        <label htmlFor={inputId} className={styles.importButton}>
          Import
        </label>
        <input
          accept="audio/*"
          className={styles.fileInput}
          id={inputId}
          multiple
          onChange={(event) => {
            if (event.currentTarget.files) {
              onImportFiles(event.currentTarget.files);
            }

            event.currentTarget.value = "";
          }}
          type="file"
        />
      </div>
      {stems.length === 0 ? (
        <div className={styles.emptyState}>No stems</div>
      ) : (
        <div className={styles.stemList}>
          {stems.map((stem) => {
            const mix = getStemMix(mixStates, stem.id);
            const isActive = stem.id === activeStemId;

            return (
              <div
                key={stem.id}
                className={isActive ? styles.activeStem : styles.stemRow}
              >
                <button
                  className={styles.stemSelect}
                  onClick={() => onSelectStem(stem.id)}
                  type="button"
                >
                  <span className={styles.stemName}>{stem.name}</span>
                  <small>{formatDuration(stem.durationSeconds)}</small>
                </button>
                <div className={styles.mixControls}>
                  <button
                    aria-pressed={mix.solo}
                    className={mix.solo ? styles.soloButtonActive : styles.soloButton}
                    onClick={() => onToggleSolo(stem.id)}
                    title="Solo"
                    type="button"
                  >
                    S
                  </button>
                  <button
                    aria-pressed={mix.muted}
                    className={mix.muted ? styles.muteButtonActive : styles.muteButton}
                    onClick={() => onToggleMute(stem.id)}
                    title="Mute"
                    type="button"
                  >
                    M
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {projectNotice && <p className={styles.notice}>{projectNotice}</p>}
    </section>
  );
}

function formatDuration(durationSeconds?: number): string {
  if (durationSeconds === undefined) {
    return "duration unknown";
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
