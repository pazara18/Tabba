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
