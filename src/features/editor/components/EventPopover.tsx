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

