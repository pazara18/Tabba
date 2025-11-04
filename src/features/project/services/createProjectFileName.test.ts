import { describe, expect, it } from "vitest";
import { createProjectFixture } from "../../../test/fixtures/createProjectFixture";
import { createProjectFileName } from "./createProjectFileName";

describe("createProjectFileName", () => {
  it("creates a portable tabba project filename", () => {
    expect(createProjectFileName(createProjectFixture())).toBe("stem-tabs.tabba.json");
  });

  it("removes unsupported filename characters", () => {
    const project = {
      ...createProjectFixture(),
      name: "Suno: Lead / Bass #4",
    };

    expect(createProjectFileName(project)).toBe("suno-lead-bass-4.tabba.json");
  });

  it("falls back when the project name has no filename characters", () => {
    const project = {
      ...createProjectFixture(),
      name: " !!! ",
    };

    expect(createProjectFileName(project)).toBe("tabba-project.tabba.json");
  });
});
