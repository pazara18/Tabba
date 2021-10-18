import { useMemo, useState } from "react";
import type { TabTrack } from "../../project/types";
import { trackToAsciiTab } from "../services/trackToAsciiTab";
import styles from "./RawTabView.module.css";

interface RawTabViewProps {
  duration: number;
  track: TabTrack;
}
