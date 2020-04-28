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
