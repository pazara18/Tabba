import type { TabbaProject } from "../types";

export function serializeProject(project: TabbaProject): string {
  return `${JSON.stringify(project, null, 2)}\n`;
}
