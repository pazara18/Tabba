import { describe, expect, it } from "vitest";
import { createProjectFixture } from "../../../test/fixtures/createProjectFixture";
import { addStemToProject, setStemDuration } from "./updateProjectStems";

describe("updateProjectStems", () => {
  it("adds a stem without mutating the original project", () => {
    const project = createProjectFixture();
