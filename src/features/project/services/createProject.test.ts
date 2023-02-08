import { describe, expect, it } from "vitest";
import { PROJECT_SCHEMA_VERSION } from "../types";
import { createProject } from "./createProject";

describe("createProject", () => {
  it("creates an empty versioned project", () => {
    const project = createProject({
      name: "Stem tabs",
      createId: () => "project-1",
      now: () => new Date("2026-04-15T12:00:00.000Z"),
    });

    expect(project).toEqual({
      schemaVersion: PROJECT_SCHEMA_VERSION,
      id: "project-1",
      name: "Stem tabs",
      stems: [],
      tracks: [],
      createdAt: "2026-04-15T12:00:00.000Z",
      updatedAt: "2026-04-15T12:00:00.000Z",
    });
  });

  it("uses a default project name when none is provided", () => {
    const project = createProject({
      createId: () => "project-2",
      now: () => new Date("2026-04-15T13:00:00.000Z"),
    });

    expect(project.name).toBe("Untitled Tabba Project");
    expect(project.createdAt).toBe(project.updatedAt);
  });

  it("can create a project with runtime defaults", () => {
    const project = createProject();

