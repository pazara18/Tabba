import { describe, expect, it } from "vitest";
import { createProjectFixture } from "../../../test/fixtures/createProjectFixture";
import { addStemToProject, setStemDuration } from "./updateProjectStems";

describe("updateProjectStems", () => {
  it("adds a stem without mutating the original project", () => {
    const project = createProjectFixture();
    const updated = addStemToProject(
      project,
      { id: "stem-2", name: "Bass", offsetSeconds: 0 },
      new Date("2026-04-15T15:00:00.000Z")
    );

    expect(project.stems).toHaveLength(1);
    expect(updated.stems.map((stem) => stem.id)).toEqual(["stem-1", "stem-2"]);
    expect(updated.updatedAt).toBe("2026-04-15T15:00:00.000Z");
  });

  it("records stem duration by id", () => {
    const project = createProjectFixture();
    const updated = setStemDuration(
      project,
      "stem-1",
      61.25,
      new Date("2026-04-15T15:30:00.000Z")
    );

    expect(updated.stems[0].durationSeconds).toBe(61.25);
    expect(updated.updatedAt).toBe("2026-04-15T15:30:00.000Z");
  });
});
