import { useMemo, useState } from "react";
import type { TabTrack } from "../../project/types";
import { trackToAsciiTab } from "../services/trackToAsciiTab";
import styles from "./RawTabView.module.css";

interface RawTabViewProps {
  duration: number;
  track: TabTrack;
}

export function RawTabView({ duration, track }: RawTabViewProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const ascii = useMemo(() => trackToAsciiTab(track, duration), [duration, track]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ascii);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    window.setTimeout(() => setCopyState("idle"), 1600);
  };

  return (
