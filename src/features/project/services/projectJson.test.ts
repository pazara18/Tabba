import { describe, expect, it } from "vitest";
import { createProjectFixture } from "../../../test/fixtures/createProjectFixture";
import { PROJECT_SCHEMA_VERSION } from "../types";
import { importProjectJson } from "./importProjectJson";
import { markProjectSaved, migrateProjectData } from "./migrateProject";
import { ProjectImportError } from "./projectImportError";
import { serializeProject } from "./serializeProject";
import { validateProject } from "./validateProject";

describe("project JSON services", () => {
  it("serializes a project with stable formatting", () => {
    const json = serializeProject(createProjectFixture());

    expect(json).toContain('"schemaVersion": 1');
    expect(json.endsWith("\n")).toBe(true);
    expect(JSON.parse(json)).toEqual(createProjectFixture());
  });

  it("imports a valid project JSON file", () => {
    const project = createProjectFixture();
    const imported = importProjectJson(serializeProject(project));

    expect(imported).toEqual(project);
  });

  it("rejects invalid JSON", () => {
    expect(() => importProjectJson("{")).toThrow(ProjectImportError);
  });

  it("rejects structurally invalid project JSON", () => {
    expect(() => importProjectJson(JSON.stringify({ schemaVersion: 1 }))).toThrow(
      "Invalid Tabba project file."
    );
  });

  it("rejects unsupported schema versions", () => {
