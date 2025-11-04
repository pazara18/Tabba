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
    const project = { ...createProjectFixture(), schemaVersion: 99 };

    expect(() => importProjectJson(JSON.stringify(project))).toThrow(
      "Unsupported project schema version: 99."
    );
  });

  it("returns validation issues for malformed top-level fields", () => {
    const result = validateProject({
      schemaVersion: PROJECT_SCHEMA_VERSION,
      id: "",
      name: 12,
      createdAt: "not-a-date",
      updatedAt: null,
      stems: "missing",
      tracks: {},
    });

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual([
      "id must be a non-empty string.",
      "name must be a non-empty string.",
      "createdAt must be an ISO date string.",
      "updatedAt must be an ISO date string.",
      "stems must be an array.",
      "tracks must be an array.",
    ]);
  });

  it("returns validation issues for malformed nested fields", () => {
    const project = createProjectFixture();
    const invalidProject = {
      ...project,
      stems: [
        {
          id: "stem-1",
          name: "Lead stem",
          offsetSeconds: Number.NaN,
          durationSeconds: "long",
          file: {
            name: "lead.wav",
            type: "",
            sizeBytes: "large",
            lastModifiedMs: "yesterday",
          },
        },
        {
          id: "stem-2",
          name: "Rhythm stem",
          offsetSeconds: 0,
          file: "bad-file",
        },
        "bad-stem",
      ],
      tracks: [
        {
          id: "track-1",
          stemId: "stem-1",
          name: "Lead guitar",
          instrument: "synth",
          tuning: {
            id: "guitar-standard",
            name: "Standard guitar",
            instrument: "guitar",
            strings: [{ stringNumber: "one", openPitch: "" }, "bad-string"],
          },
          events: [
            {
              id: "event-1",
              startSeconds: "now",
              durationSeconds: Infinity,
              kind: "tap",
              texture: "busy",
              detectedPitches: {},
              chosenPositions: null,
              candidates: "none",
              confidence: "high",
              locked: "yes",
            },
            "bad-event",
          ],
        },
        {
          id: "track-2",
          stemId: "stem-2",
          name: "Rhythm guitar",
          instrument: "guitar",
          tuning: "bad-tuning",
          events: [],
        },
        "bad-track",
      ],
    };

    const result = validateProject(invalidProject);

    expect(result.valid).toBe(false);
    expect(result.issues).toContain("stems[0].offsetSeconds must be a finite number.");
    expect(result.issues).toContain("stems[0].durationSeconds must be a finite number.");
    expect(result.issues).toContain("stems[0].file.type must be a non-empty string.");
    expect(result.issues).toContain("stems[0].file.sizeBytes must be a finite number.");
    expect(result.issues).toContain("stems[0].file.lastModifiedMs must be a finite number.");
    expect(result.issues).toContain("stems[1].file must be an object.");
    expect(result.issues).toContain("stems[2] must be an object.");
    expect(result.issues).toContain("tracks[0].instrument must be guitar or bass.");
    expect(result.issues).toContain(
      "tracks[0].tuning.strings[0].stringNumber must be a finite number."
    );
    expect(result.issues).toContain(
      "tracks[0].tuning.strings[0].openPitch must be a non-empty string."
    );
    expect(result.issues).toContain("tracks[0].tuning.strings[1] must be an object.");
    expect(result.issues).toContain(
      "tracks[0].events[0].kind must be a supported tab event kind."
    );
    expect(result.issues).toContain("tracks[0].events[0].texture must be mono, poly, or uncertain.");
    expect(result.issues).toContain("tracks[0].events[0].detectedPitches must be an array.");
    expect(result.issues).toContain("tracks[0].events[0].chosenPositions must be an array.");
    expect(result.issues).toContain("tracks[0].events[0].candidates must be an array.");
    expect(result.issues).toContain("tracks[0].events[0].confidence must be a finite number.");
    expect(result.issues).toContain("tracks[0].events[0].locked must be a boolean.");
    expect(result.issues).toContain("tracks[0].events[1] must be an object.");
    expect(result.issues).toContain("tracks[1].tuning must be an object.");
    expect(result.issues).toContain("tracks[2] must be an object.");
  });

  it("passes through current schema projects during migration", () => {
    const project = createProjectFixture();

    expect(migrateProjectData(project)).toBe(project);
  });

  it("leaves non-object migration input for validation to reject", () => {
    expect(migrateProjectData("not-a-project")).toBe("not-a-project");
  });

  it("marks a project saved with an updated timestamp", () => {
    const saved = markProjectSaved(
      createProjectFixture(),
      new Date("2026-04-15T14:00:00.000Z")
    );

    expect(saved.updatedAt).toBe("2026-04-15T14:00:00.000Z");
    expect(saved.createdAt).toBe("2026-04-15T12:00:00.000Z");
  });
});
