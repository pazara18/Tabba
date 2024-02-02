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
