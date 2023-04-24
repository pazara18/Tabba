import { PROJECT_SCHEMA_VERSION, type TabbaProject } from "../types";
import { ProjectImportError } from "./projectImportError";
import { isRecord } from "./projectShape";

export function migrateProjectData(value: unknown): unknown {
