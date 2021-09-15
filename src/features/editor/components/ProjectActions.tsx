import { useId } from "react";
import styles from "./ProjectActions.module.css";

interface ProjectActionsProps {
  onExportProject: () => void;
  onImportProject: (file: File) => void;
}

export function ProjectActions({ onExportProject, onImportProject }: ProjectActionsProps) {
  const inputId = useId();

  return (
    <div className={styles.actions} aria-label="Project actions">
      <button type="button" onClick={onExportProject}>
        Export
      </button>
      <label htmlFor={inputId}>Import</label>
      <input
        accept=".tabba.json,application/json"
        id={inputId}
        onChange={(event) => {
