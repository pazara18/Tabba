import { describe, expect, it } from "vitest";
import { formatPlaybackTime } from "./formatPlaybackTime";

describe("formatPlaybackTime", () => {
  it("formats seconds as minutes, seconds, and milliseconds", () => {
