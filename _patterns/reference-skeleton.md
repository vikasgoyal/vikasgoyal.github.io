---
title: Reference Skeleton
n: 73
family: build
maturity: emg
axes: [context]
intent: Anchor coding agents to a small working reference app that shows how the team builds things.
aka: reference application, golden-path repo, exemplar codebase
status: full

problem: >-
  In a new system, agents have no existing code to imitate, so each session invents its own
  structure, error handling and naming. Written conventions help, but agents follow working
  examples far more reliably than prose. The first weeks of a greenfield project set patterns
  that are expensive to undo.
forces:
  - Agents copy what they see.
  - Conventions written as prose are ambiguous.
  - A reference that isn't maintained misleads.
  - Too rich a reference turns into a framework nobody understands.

solution: >-
  Build a small, compilable reference app that shows the team's way of handling each recurring
  concern: one request path end to end, one background job, error handling, logging,
  configuration, tests at each level, and the CI pipeline. Agents can draft it, but people review
  it closely, because everything built later copies it. Keep it running and tested in CI. The
  memory file tells agents to follow it ("new endpoints follow `/reference`"), and new services
  are scaffolded from it. When a convention changes, change the reference first, and later work
  follows.

diagram: reference-skeleton
diagram_caption: One small, reviewed example sets the pattern; every agent session copies working code instead of guessing from prose.

use_when:
  - Greenfield systems and new services
  - Several teams or many agents building similar components
  - Conventions drift between agent sessions
  - Platform teams offering a golden path
avoid_when:
  - Mature codebases with consistent examples to copy already
  - One-off prototypes
  - Teams that can't keep the reference compiling

tradeoffs:
  latency:     { score: 1, note: "Agents read a few files before starting" }
  cost:        { score: 2, note: "Building and maintaining the reference" }
  complexity:  { score: 2, note: "A small app kept green in CI" }
  reliability: { score: 4, note: "Consistent structure across agent sessions" }
gains:
  - Consistent structure across many agent-built components
  - Reviews focus on logic, not style and structure
  - Conventions change in one place
costs:
  - The reference needs an owner and upkeep
  - Shortcuts in the reference get copied everywhere
  - Too much in it slows understanding

example:
  scenario: The Linkwatch team starts its new click-analytics service.
  steps:
    - who: Reference
      what: "A 400-line service with one ingest endpoint, one queue consumer, structured logging, typed config, unit and integration tests, and CI."
    - who: Memory file
      what: "\"New endpoints and consumers follow `/reference`: copy its structure and tests.\""
    - who: Build
      what: "Agents add 6 endpoints in a week. Structure is consistent, so reviewers spend their time on the logic."
    - who: Drift
      what: "One agent pulls in a different logging library. The reviewer points to the reference and it's replaced."
    - who: Change
      what: "The team switches config libraries. The reference is updated first, and the next agent tasks follow it."

failures:
  - failure: Rotting reference
    symptom: Reference no longer builds, so agents ignore it
    fix: Keep it in CI and fix it like production code
  - failure: Bloat
    symptom: Reference grows into a framework
    fix: One minimal example per concern
  - failure: Copied shortcuts
    symptom: Demo hacks appear in production code
    fix: No shortcuts in the reference; it is production quality
  - failure: Ignored reference
    symptom: Agents still invent their own structure
    fix: Point to it in the memory file; reviewers enforce it

related:
  - { type: Combines with, pattern: project-memory-file }
  - { type: Combines with, pattern: agent-ready-repo }
  - { type: Combines with, pattern: spike-and-compare }
  - { type: Combines with, pattern: thin-slice-mvps }
  - { type: Scales into, pattern: shared-knowledge-layer }
---
