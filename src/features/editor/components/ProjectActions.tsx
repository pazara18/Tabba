import { useId } from "react";
import styles from "./ProjectActions.module.css";

interface ProjectActionsProps {
  onExportProject: () => void;
  onImportProject: (file: File) => void;
}

export function ProjectActions({ onExportProject, onImportProject }: ProjectActionsProps) {
  const inputId = useId();

  return (
