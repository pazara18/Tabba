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
