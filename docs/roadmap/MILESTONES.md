# Roadmap Milestones

These milestones should be completed in order unless a later task is needed to
unblock a small implementation detail. Each milestone should leave the app in a
usable state.

## Milestone 0: Repository Foundation

Goal: create a healthy TypeScript application shell with guardrails.

Deliverables:

- Vite, React, TypeScript scaffold.
- Test runner configured for domain logic.
- Linting and formatting commands.
- Basic source layout from `AGENTS.md`.
- Empty editor-first app screen.
- README with local development commands.

Acceptance criteria:

- `npm install` works from a fresh clone.
- `npm run dev` starts the app.
- `npm test` runs at least one placeholder domain test.
- `npm run lint` or equivalent validates the scaffold.
- No generated source file becomes a dumping ground.

## Milestone 1: Project Schema and Persistence

Goal: define the durable project format before editor behavior grows around it.

Deliverables:

- Versioned `.tabba.json` schema.
- Project, stem, tab track, tab event, pitch estimate, candidate, and position
  types.
- Project creation service.
- JSON export service.
- JSON import and validation service.
- Schema migration entry point.
- Minimal browser autosave placeholder.

Acceptance criteria:

- A new empty project can be created.
- A project can be exported to JSON.
- The same JSON can be imported without losing data.
- Invalid or unsupported project files produce useful errors.
- Tests cover project creation, import/export, and schema version checks.

Initial schema concepts:

```ts
type InstrumentKind = "guitar" | "bass";
type TabEventKind = "single" | "chord" | "bend" | "slide" | "unknown";
type TextureKind = "mono" | "poly" | "uncertain";
```

## Milestone 2: Audio Import and Transport

Goal: import local stem audio and play it reliably in the browser.

Deliverables:

- Local file import for common browser-supported audio formats.
