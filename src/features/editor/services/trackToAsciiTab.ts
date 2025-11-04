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

  return [`${formatTimeLabel(line.startSeconds)}`, ...rows].join("\n");
}

function collectPositionsOnString(
  events: TabEvent[],
  stringNumber: number
): { event: TabEvent; position: TabPosition }[] {
  const matches: { event: TabEvent; position: TabPosition }[] = [];

  for (const event of events) {
    for (const position of event.chosenPositions) {
      if (position.stringNumber === stringNumber) {
        matches.push({ event, position });
      }
    }
  }

  return matches.sort((a, b) => a.event.startSeconds - b.event.startSeconds);
}

function createDashedCells(columnsPerLine: number): string[] {
  return Array.from({ length: columnsPerLine }, () => "-");
}

function writeFretAt(cells: string[], startColumn: number, fret: number): void {
  const text = String(Math.max(0, Math.floor(fret)));

  for (let index = 0; index < text.length; index += 1) {
    const column = startColumn + index;
    if (column < cells.length) {
      cells[column] = text[index];
    }
  }
}

function padLabel(label: string, width: number): string {
  if (label.length >= width) {
    return label;
  }
  return label + " ".repeat(width - label.length);
}

function formatStringLabel(openPitch: string): string {
  // Strip the octave digit so labels look like UG (E, A, D, G, B, e).
  const match = openPitch.match(/^([A-Ga-g][#b]?)/);
  return match ? match[1] : openPitch;
}

function formatTimeLabel(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
