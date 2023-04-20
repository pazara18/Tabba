import type { TabbaProject } from "../types";
import { migrateProjectData } from "./migrateProject";
import { ProjectImportError } from "./projectImportError";
import { validateProject } from "./validateProject";

export function importProjectJson(jsonText: string): TabbaProject {
  const parsed = parseProjectJson(jsonText);
  const migrated = migrateProjectData(parsed);
  const validation = validateProject(migrated);

  if (!validation.valid) {
    throw new ProjectImportError("Invalid Tabba project file.", validation.issues);
