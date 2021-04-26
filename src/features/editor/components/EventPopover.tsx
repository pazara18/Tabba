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
