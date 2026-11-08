---
title: Sandboxed Execution
n: 21
family: safety
maturity: est
axes: [tool]
intent: Code and actions run in isolation with checkpoints and rollback.
aka: isolated execution, agent sandbox, checkpoint and rollback
status: full

problem: >-
  Agents that write and run code, edit files or operate a browser can do damage by mistake:
  delete the wrong folder, install a malicious package, leak credentials or corrupt data
  halfway through a change. Running that work directly on real machines and real data means
  every mistake lands in production.
forces:
  - Agents are most useful when they can actually run code and try things.
  - Generated code and downloaded packages can't be fully trusted.
  - Multi-step changes can fail halfway and leave things broken.
  - Isolation that's too strict blocks legitimate work, like reaching needed APIs.

solution: >-
  Run the agent's actions inside an isolated environment, such as a container, VM or
  sandboxed workspace, with no access to production credentials and network access limited
  to an allowlist. Give it a copy or a branch of the data, not the original. Take
  checkpoints before risky steps so a failed change can be rolled back. Results leave the
  sandbox only through a defined channel, like a pull request, a diff or a reviewed file,
  where checks or a person decide what's promoted to the real system.

diagram: sandboxed-execution
diagram_caption: The agent is free to experiment inside the sandbox. Nothing reaches the real system except through the promotion gate.

use_when:
  - The agent writes and runs code, or installs packages
  - The agent edits files, databases or infrastructure
  - It processes untrusted content that might contain attacks
  - Multi-step changes need a clean undo
avoid_when:
  - The agent only reads data and calls narrow, safe APIs
  - The task genuinely needs live production access; use strict approvals instead
  - Sandbox startup time would dominate very short tasks

tradeoffs:
  latency:     { score: 2, note: "Sandbox startup and promotion add a little time" }
  cost:        { score: 2, note: "Compute for isolated environments" }
  complexity:  { score: 3, note: "Isolation, network allowlists, checkpoints, promotion" }
  reliability: { score: 5, note: "Mistakes stay inside; rollback is built in" }
gains:
  - Agents can experiment freely without risking real systems
  - Failed or harmful changes roll back cleanly
  - A clear promotion step makes review natural
costs:
  - Environment setup and upkeep
  - Differences between sandbox and production can hide issues
  - Network allowlists need maintenance as needs change

example:
  scenario: A coding agent is asked to upgrade a web service's database library to a new major version.
  steps:
    - who: Sandbox
      what: "Starts a container with a clone of the repo and a test database seeded with anonymized data. Network access is limited to the package registry. No production credentials are present."
    - who: Agent
      what: "Upgrades the library, runs the tests and sees 14 failures. It takes checkpoint 1, then fixes the API changes."
    - who: Agent
      what: "Tries a data migration script. It corrupts the test database, so the agent rolls back to checkpoint 1 and writes a safer migration."
    - who: Agent
      what: "All 412 tests pass. A package it tried to add from an unknown domain was blocked by the network allowlist."
    - who: Promotion gate
      what: "The only output is a pull request containing the diff, the test results and the migration plan. A developer reviews it and merges after a staging run."

failures:
  - failure: Leaky sandbox
    symptom: Production credentials or network reachable from inside
    fix: Separate credentials; deny network by default; test the isolation
  - failure: Sandbox and production differ
    symptom: Works in the sandbox, breaks in production
    fix: Mirror production configuration; run a staging step before release
  - failure: Unreviewed promotion
    symptom: Changes auto-merged without checks
    fix: Promotion only through tests plus human review for risky changes
  - failure: No rollback point
    symptom: Half-finished change leaves the environment broken
    fix: Checkpoint before every risky step; discard the sandbox if needed

related:
  - { type: Combines with, pattern: code-as-action }
  - { type: Combines with, pattern: bounded-autonomy }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: guardrails }
  - { type: Provided by, pattern: agent-harness }
---
