import { PROJECT_SCHEMA_VERSION } from "../types";
import { isRecord } from "./projectShape";

export interface ValidationResult {
  valid: boolean;
  issues: string[];
}

export function validateProject(value: unknown): ValidationResult {
  const issues: string[] = [];

  if (!isRecord(value)) {
    return { valid: false, issues: ["Project file must contain an object."] };
  }

  requireNumber(value.schemaVersion, "schemaVersion", issues);
  requireString(value.id, "id", issues);
  requireString(value.name, "name", issues);
  requireIsoDate(value.createdAt, "createdAt", issues);
  requireIsoDate(value.updatedAt, "updatedAt", issues);
  requireArray(value.stems, "stems", issues);
  requireArray(value.tracks, "tracks", issues);

  if (Array.isArray(value.stems)) {
    value.stems.forEach((stem, index) => validateStem(stem, `stems[${index}]`, issues));
  }

  if (Array.isArray(value.tracks)) {
    value.tracks.forEach((track, index) => validateTrack(track, `tracks[${index}]`, issues));
  }

  if (value.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    issues.push(`Unsupported project schema version: ${String(value.schemaVersion)}.`);
  }

  return { valid: issues.length === 0, issues };
}

function validateStem(value: unknown, path: string, issues: string[]) {
  if (!isRecord(value)) {
    issues.push(`${path} must be an object.`);
    return;
  }

  requireString(value.id, `${path}.id`, issues);
  requireString(value.name, `${path}.name`, issues);
  requireNumber(value.offsetSeconds, `${path}.offsetSeconds`, issues);

  if (value.durationSeconds !== undefined) {
    requireNumber(value.durationSeconds, `${path}.durationSeconds`, issues);
  }

  if (value.file !== undefined) {
    validateStemFile(value.file, `${path}.file`, issues);
  }
}

function validateStemFile(value: unknown, path: string, issues: string[]) {
  if (!isRecord(value)) {
    issues.push(`${path} must be an object.`);
    return;
  }

  requireString(value.name, `${path}.name`, issues);
  requireString(value.type, `${path}.type`, issues);
  requireNumber(value.sizeBytes, `${path}.sizeBytes`, issues);

  if (value.lastModifiedMs !== undefined) {
    requireNumber(value.lastModifiedMs, `${path}.lastModifiedMs`, issues);
  }
}

function validateTrack(value: unknown, path: string, issues: string[]) {
  if (!isRecord(value)) {
    issues.push(`${path} must be an object.`);
    return;
  }

  requireString(value.id, `${path}.id`, issues);
  requireString(value.stemId, `${path}.stemId`, issues);
  requireString(value.name, `${path}.name`, issues);
  requireInstrument(value.instrument, `${path}.instrument`, issues);
  validateTuning(value.tuning, `${path}.tuning`, issues);
  requireArray(value.events, `${path}.events`, issues);

  if (Array.isArray(value.events)) {
    value.events.forEach((event, index) => validateEvent(event, `${path}.events[${index}]`, issues));
  }
}

function validateTuning(value: unknown, path: string, issues: string[]) {
  if (!isRecord(value)) {
    issues.push(`${path} must be an object.`);
    return;
  }

  requireString(value.id, `${path}.id`, issues);
  requireString(value.name, `${path}.name`, issues);
  requireInstrument(value.instrument, `${path}.instrument`, issues);
  requireArray(value.strings, `${path}.strings`, issues);

  if (Array.isArray(value.strings)) {
    value.strings.forEach((string, index) => validateTuningString(string, `${path}.strings[${index}]`, issues));
  }
}

function validateTuningString(value: unknown, path: string, issues: string[]) {
  if (!isRecord(value)) {
    issues.push(`${path} must be an object.`);
    return;
  }

  requireNumber(value.stringNumber, `${path}.stringNumber`, issues);
  requireString(value.openPitch, `${path}.openPitch`, issues);
}

function validateEvent(value: unknown, path: string, issues: string[]) {
  if (!isRecord(value)) {
    issues.push(`${path} must be an object.`);
    return;
  }

  requireString(value.id, `${path}.id`, issues);
  requireNumber(value.startSeconds, `${path}.startSeconds`, issues);
  requireNumber(value.durationSeconds, `${path}.durationSeconds`, issues);
  requireEventKind(value.kind, `${path}.kind`, issues);
  requireTexture(value.texture, `${path}.texture`, issues);
  requireArray(value.detectedPitches, `${path}.detectedPitches`, issues);
  requireArray(value.chosenPositions, `${path}.chosenPositions`, issues);
  requireArray(value.candidates, `${path}.candidates`, issues);
  requireNumber(value.confidence, `${path}.confidence`, issues);
  requireBoolean(value.locked, `${path}.locked`, issues);
}

function requireString(value: unknown, path: string, issues: string[]) {
  if (typeof value !== "string" || value.length === 0) {
    issues.push(`${path} must be a non-empty string.`);
  }
}

function requireNumber(value: unknown, path: string, issues: string[]) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    issues.push(`${path} must be a finite number.`);
  }
}

function requireArray(value: unknown, path: string, issues: string[]) {
  if (!Array.isArray(value)) {
    issues.push(`${path} must be an array.`);
  }
}

function requireBoolean(value: unknown, path: string, issues: string[]) {
  if (typeof value !== "boolean") {
    issues.push(`${path} must be a boolean.`);
  }
}

function requireIsoDate(value: unknown, path: string, issues: string[]) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    issues.push(`${path} must be an ISO date string.`);
  }
}

function requireInstrument(value: unknown, path: string, issues: string[]) {
  if (value !== "guitar" && value !== "bass") {
    issues.push(`${path} must be guitar or bass.`);
  }
}

function requireEventKind(value: unknown, path: string, issues: string[]) {
  if (!["single", "chord", "bend", "slide", "unknown"].includes(String(value))) {
    issues.push(`${path} must be a supported tab event kind.`);
  }
}

function requireTexture(value: unknown, path: string, issues: string[]) {
  if (!["mono", "poly", "uncertain"].includes(String(value))) {
    issues.push(`${path} must be mono, poly, or uncertain.`);
  }
}
