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
