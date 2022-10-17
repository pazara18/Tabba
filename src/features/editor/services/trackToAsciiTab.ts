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

export interface TrackToAsciiTabOptions {
  lineDurationSeconds?: number;
  columnsPerLine?: number;
}

export function trackToAsciiTab(
  track: TabTrack,
  totalDurationSeconds: number,
  options: TrackToAsciiTabOptions = {}
): string {
  const lineDurationSeconds = options.lineDurationSeconds ?? DEFAULT_TAB_LINE_SECONDS;
  const columnsPerLine = Math.max(
    MIN_COLUMNS_PER_LINE,
    options.columnsPerLine ?? DEFAULT_COLUMNS_PER_LINE
  );
  const lines = createTabLines(totalDurationSeconds, lineDurationSeconds);
  const stringRows = [...track.tuning.strings].sort(
    (a, b) => a.stringNumber - b.stringNumber
  );
  const stemLabels = stringRows.map((string) => formatStringLabel(string.openPitch));
  const labelWidth = Math.max(...stemLabels.map((label) => label.length));

  return lines
    .map((line) => buildStanza(line, track.events, stringRows, stemLabels, labelWidth, columnsPerLine))
    .join("\n\n");
}

interface StringRow {
  stringNumber: number;
  openPitch: string;
}

function buildStanza(
  line: TabLine,
  allEvents: TabEvent[],
  stringRows: StringRow[],
  stemLabels: string[],
  labelWidth: number,
  columnsPerLine: number
): string {
  const lineEvents = getEventsForLine(allEvents, line);
  const rows = stringRows.map((string, rowIndex) => {
    const cells = createDashedCells(columnsPerLine);
    const positions = collectPositionsOnString(lineEvents, string.stringNumber);

    for (const { event, position } of positions) {
      const ratio =
        line.durationSeconds > 0
          ? (event.startSeconds - line.startSeconds) / line.durationSeconds
          : 0;
      const startColumn = Math.min(
        columnsPerLine - 1,
        Math.max(0, Math.round(ratio * (columnsPerLine - 1)))
      );
      writeFretAt(cells, startColumn, position.fret);
    }

    const label = padLabel(stemLabels[rowIndex], labelWidth);
    return `${label}|${cells.join("")}|`;
  });
