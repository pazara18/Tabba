import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      all: true,
      exclude: ["**/*.test.ts", "**/*.test.tsx"],
      include: [
        "src/domain/fingering/*.ts",
        "src/domain/pitch/*.ts",
        "src/features/analysis/services/*.ts",
        "src/features/editor/services/*.ts",
        "src/features/audio/services/*.ts",
        "src/domain/instruments/standardTunings.ts",
        "src/features/project/services/*.ts",
      ],
      provider: "v8",
      reporter: ["text", "json-summary"],
      thresholds: {
        branches: 85,
        functions: 95,
