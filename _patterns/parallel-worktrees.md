---
title: Parallel Agents in Worktrees
n: 48
family: review
maturity: emg
axes: [coordination]
intent: Several agents work on isolated branches at once, then merge through review.
aka: git worktrees for agents, multi-agent coding, parallel branches
status: full

problem: >-
  One coding agent works through tasks one after another, while the developer waits or
  context-switches. Running several agents in the same folder doesn't work either: they
  overwrite each other's files, run tests against each other's half-finished changes, and
  produce conflicts nobody can untangle.
forces:
  - Many tasks in a backlog are independent and could run at once.
  - Agents sharing one working folder interfere with each other.
  - The developer's review capacity, not agent speed, becomes the limit.
  - Parallel changes to the same files create merge conflicts.

solution: >-
  Give each agent its own isolated workspace, typically a git worktree or a separate
  container, with its own branch, dependencies and test database. Pick tasks that touch
  different parts of the codebase, and give each a clear brief and spec. Agents work and
  test independently, then each opens its own pull request. The developer reviews and merges
  them one at a time; later branches rebase onto the updated main and re-run their checks
  before merging. Keep the number of parallel agents at what the reviewer can actually
  keep up with.

diagram: parallel-worktrees
diagram_caption: Isolation prevents interference while agents work. Merging one PR at a time, with a rebase and re-check in between, prevents conflicts on the way in.

use_when:
  - The backlog has several independent tasks
  - The repo is agent-ready, so each workspace can set up and test itself
  - Review capacity can keep up with several PRs
  - Wall-clock time matters more than token cost
avoid_when:
  - Tasks touch the same files or depend on each other
  - Setup is slow or needs shared resources each agent would fight over
  - The reviewer is already the bottleneck with one agent

tradeoffs:
  latency:     { score: 1, note: "Several tasks finish in the time of one" }
  cost:        { score: 4, note: "Several agents' tokens and compute at once" }
  complexity:  { score: 3, note: "Worktrees, isolated environments, merge order" }
  reliability: { score: 3, note: "Good with independent tasks; conflicts otherwise" }
gains:
  - Much more throughput from the same developer time
  - Each agent's changes stay isolated until reviewed
  - Easy to throw away one agent's attempt without affecting the others
costs:
  - Review load multiplies with every agent
  - Merge conflicts when tasks weren't truly independent
  - More compute and token cost per hour

example:
  scenario: A developer has 4 independent Linkwatch backlog items and runs 3 agents in parallel.
  steps:
    - who: Setup
      what: "Creates 3 worktrees (`../lw-csv`, `../lw-darkmode`, `../lw-metrics`), each on its own branch. Each runs `make setup` with its own SQLite file."
    - who: Agents
      what: "Agent A adds CSV export of check history. Agent B adds dark mode to the web UI. Agent C adds a Prometheus metrics endpoint. The fourth item touches the checker core and waits."
    - who: 40 minutes later
      what: "3 PRs are open, each with passing tests. The developer reviews CSV export first and merges it."
    - who: Rebase
      what: "Agent C rebases onto the new main and hits one conflict in `routes.py`, where both added a route. It resolves it, re-runs tests and pushes. It's reviewed and merged next, then dark mode."
    - who: Result
      what: "3 features merged in about 2 hours instead of most of a day. The developer limits it to 3 agents because a 4th PR would wait for review anyway."

failures:
  - failure: Shared workspace
    symptom: Agents overwrite files and break each other's tests
    fix: One worktree or container per agent, never a shared folder
  - failure: Hidden dependencies between tasks
    symptom: Merge conflicts or broken behavior after merging
    fix: Pick tasks in different areas; merge one at a time with re-tests
  - failure: Review pile-up
    symptom: Finished PRs wait hours or days for review
    fix: Limit parallel agents to review capacity
  - failure: Shared resource contention
    symptom: Agents fight over one test database or port
    fix: Isolated databases and ports per workspace

related:
  - { type: Analog of, pattern: parallelization }
  - { type: Requires, pattern: agent-ready-repo }
  - { type: Requires, pattern: pr-review-gate }
  - { type: Analog of, pattern: orchestrator-workers }
  - { type: Analog of, pattern: sandboxed-execution }
---
