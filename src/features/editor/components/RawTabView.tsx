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
    <article className={styles.rawView} aria-label={`${track.name} raw tab`}>
      <div className={styles.header}>
        <div>
          <h3>{track.name}</h3>
          <span>{track.events.length} events</span>
        </div>
        <button className={styles.copyButton} onClick={handleCopy} type="button">
          {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy"}
        </button>
      </div>
      <pre className={styles.tab}>{ascii}</pre>
    </article>
  );
}
