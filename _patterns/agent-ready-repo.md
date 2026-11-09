---
title: Agent-Ready Repo
n: 42
family: setup
maturity: emg
axes: [tool, verification]
intent: One-command setup, scripted checks and clear docs, so an agent can run and verify its own work.
aka: agent-friendly codebase, self-verifying repo, AI-ready repository
status: full

problem: >-
  A coding agent can only be as reliable as its ability to check its own work. In many repos,
  setup takes tribal knowledge, tests need a manual step or a secret nobody wrote down, and
  linting runs only in CI. The agent writes code it can't run, declares success, and the
  developer finds out later that nothing works.
forces:
  - Agents improve sharply when they can run and test what they write.
  - Setup steps that live in people's heads are invisible to agents.
  - Slow or flaky checks get skipped, by agents and humans alike.
  - Making a repo agent-ready takes time away from feature work.

solution: >-
  Make the repo runnable and checkable with one command each, without human help. Provide a
  single setup command, often a dev container or script, that installs everything. Provide
  fast, deterministic checks: `make test`, `make lint`, `make typecheck`, and a quick smoke
  test of the running app. Use seed data and local fakes instead of shared environments or
  real credentials. Make error messages say what to do next. Document these commands in the
  Project Memory File so the agent uses them, and keep the same checks in CI so local and
  remote agree.

diagram: agent-ready-repo
diagram_caption: The agent closes its own loop by changing code, running the checks and reading the results, without waiting for a human or for CI.

use_when:
  - Coding agents work in the repo regularly
  - Setup or tests currently need manual steps or tribal knowledge
  - Agents often claim work is done that later fails in CI
  - Several agents or new developers need to get started quickly
avoid_when:
  - Throwaway prototypes that won't live long
  - Systems that truly can't run locally; provide a sandbox environment instead
  - Spending weeks polishing tooling before any agent work has shown value

tradeoffs:
  latency:     { score: 1, note: "Fast local checks replace waiting for CI or a person" }
  cost:        { score: 2, note: "Upfront tooling work; pays back quickly" }
  complexity:  { score: 2, note: "Scripts, seed data and a dev container" }
  reliability: { score: 5, note: "Agents verify their own changes before claiming done" }
gains:
  - Agents catch their own mistakes before a human sees them
  - New developers onboard as fast as agents do
  - Fewer "works on my machine" surprises in CI
costs:
  - Setup and test scripts need maintenance
  - Local fakes can drift from real services
  - Slow test suites need splitting into fast and full runs

example:
  scenario: A team's billing service, where agent-written PRs failed CI about 40% of the time.
  steps:
    - who: Before
      what: "Setup needed a shared staging database, two secrets passed around in chat, and a README last updated a year ago. Agents couldn't run the tests, so they guessed."
    - who: Setup
      what: "Adds a dev container plus `make setup`, which creates a local Postgres with seed data in about 90 seconds. No shared secrets are needed."
    - who: Checks
      what: "`make check` runs lint, type checks and 600 unit tests in 45 seconds. `make smoke` starts the service and calls 3 key endpoints."
    - who: CLAUDE.md
      what: "Says: “Run `make check` before every commit and `make smoke` before saying a task is done.”"
    - who: After
      what: "Agents now run checks themselves and fix most failures before opening a PR. The CI failure rate for agent PRs drops to about 8%."

failures:
  - failure: Hidden setup steps
    symptom: Agent stuck on missing tools or credentials
    fix: Script everything; test setup from a clean container regularly
  - failure: Slow checks skipped
    symptom: Agent stops running a 20-minute test suite
    fix: Fast default check (under a minute); full suite in CI
  - failure: Flaky tests
    symptom: Agent "fixes" correct code to make a flaky test pass
    fix: Quarantine flaky tests; fix or delete them
  - failure: Local and CI disagree
    symptom: Passes locally, fails in CI
    fix: Same commands and versions in both, ideally the same container

related:
  - { type: Enables, pattern: test-first-loop }
  - { type: Combines with, pattern: project-memory-file }
  - { type: Analog of, pattern: sandboxed-execution }
  - { type: Enables, pattern: parallel-worktrees }
  - { type: Combines with, pattern: pr-review-gate }
---
