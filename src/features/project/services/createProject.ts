import {
  PROJECT_SCHEMA_VERSION,
  type TabbaProject,
} from "../types";

interface CreateProjectOptions {
  name?: string;
  now?: () => Date;
  createId?: () => string;
}
