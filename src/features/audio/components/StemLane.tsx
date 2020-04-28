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
