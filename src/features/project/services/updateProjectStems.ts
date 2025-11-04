import type { Stem, TabbaProject } from "../types";

export function addStemToProject(
  project: TabbaProject,
  stem: Stem,
  updatedAt: Date
): TabbaProject {
  return {
    ...project,
    stems: [...project.stems, stem],
    updatedAt: updatedAt.toISOString(),
  };
}

export function setStemDuration(
  project: TabbaProject,
  stemId: string,
  durationSeconds: number,
  updatedAt: Date
): TabbaProject {
  return {
    ...project,
    stems: project.stems.map((stem) =>
      stem.id === stemId ? { ...stem, durationSeconds } : stem
    ),
    updatedAt: updatedAt.toISOString(),
  };
}
