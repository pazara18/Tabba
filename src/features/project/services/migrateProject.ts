import { PROJECT_SCHEMA_VERSION, type TabbaProject } from "../types";
import { ProjectImportError } from "./projectImportError";
import { isRecord } from "./projectShape";

export function migrateProjectData(value: unknown): unknown {
  if (!isRecord(value)) {
    return value;
  }

  if (value.schemaVersion === PROJECT_SCHEMA_VERSION) {
    return value;
  }

  throw new ProjectImportError(
    `Unsupported project schema version: ${String(value.schemaVersion)}.`
  );
}

export function markProjectSaved(project: TabbaProject, savedAt: Date): TabbaProject {
  return {
    ...project,
    updatedAt: savedAt.toISOString(),
  };
}
