import type { TabEvent, TabPosition } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import {
  createTabLines,
  DEFAULT_TAB_LINE_SECONDS,
  getEventsForLine,
  type TabLine,
} from "./tabLineLayout";

const DEFAULT_COLUMNS_PER_LINE = 64;
const MIN_COLUMNS_PER_LINE = 16;

