import type { TabbaProject } from "../types";
import { normalizeFileBaseName } from "./normalizeFileBaseName";

export function createProjectFileName(project: TabbaProject): string {
  return `${normalizeFileBaseName(project.name, "tabba-project")}.tabba.json`;
}
