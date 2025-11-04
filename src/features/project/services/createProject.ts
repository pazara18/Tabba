import {
  PROJECT_SCHEMA_VERSION,
  type TabbaProject,
} from "../types";

interface CreateProjectOptions {
  name?: string;
  now?: () => Date;
  createId?: () => string;
}

const defaultCreateId = () => crypto.randomUUID();

export function createProject(options: CreateProjectOptions = {}): TabbaProject {
  const now = options.now ?? (() => new Date());
  const createId = options.createId ?? defaultCreateId;
  const timestamp = now().toISOString();

  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: createId(),
    name: options.name ?? "Untitled Tabba Project",
    stems: [],
    tracks: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
