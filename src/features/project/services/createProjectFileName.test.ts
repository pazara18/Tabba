import { describe, expect, it } from "vitest";
import { createProjectFixture } from "../../../test/fixtures/createProjectFixture";
import { createProjectFileName } from "./createProjectFileName";

describe("createProjectFileName", () => {
  it("creates a portable tabba project filename", () => {
