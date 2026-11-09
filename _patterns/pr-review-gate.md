---
title: PR as Review Gate
n: 47
family: review
maturity: est
axes: [verification]
intent: Agents work on branches, and every change lands through a reviewed pull request.
aka: branch-and-PR workflow, agent pull requests, merge gate
status: full

problem: >-
  Coding agents can change many files in minutes. If they commit straight to the main
  branch, mistakes reach everyone immediately, there's no clean place to review what
  changed, and undoing a bad change means untangling it from others. Teams lose track of
  which changes came from agents and why.
forces:
  - Agent changes need human judgment before they become shared code.
  - Reviewing large diffs is slow and error-prone.
  - Too much review friction pushes people to bypass the process.
  - Automated checks catch some problems, but not design or intent.

solution: >-
  Agents never write to the main branch. Each task runs on its own branch and ends with a
  pull request that includes a short description: what changed, why, the plan it followed,
  how it was tested and anything it was unsure about. CI runs the full checks on every PR.
  A person reviews and merges; for low-risk areas, a second AI reviewer can do a first pass
  and point the human at the riskiest parts. Branch protection enforces the gate, and PRs
  stay small enough to review properly.

diagram: pr-review-gate
diagram_caption: The main branch only changes through the gate. CI and an optional AI first pass narrow down what the human reviewer needs to focus on.

use_when:
  - Any shared codebase where agents make changes
  - Teams need an audit trail of what agents changed and who approved it
  - Changes must pass CI before anyone depends on them
  - Several agents or developers work in parallel
avoid_when:
  - Personal scratch repos where speed matters more than review
  - Tiny, fully automated changes like dependency bumps that pass CI; consider auto-merge
  - When PRs would be so large that nobody can review them; slice the work first

tradeoffs:
  latency:     { score: 3, note: "Changes wait for CI and a reviewer" }
  cost:        { score: 2, note: "Reviewer time; AI first pass reduces it" }
  complexity:  { score: 1, note: "Standard Git workflow plus branch protection" }
  reliability: { score: 5, note: "Nothing reaches main without checks and a person" }
gains:
  - Every agent change is reviewed, tested and reversible
  - A clear history of what changed, why and who approved it
  - Familiar workflow for the whole team
costs:
  - Review becomes the bottleneck as agents speed up
  - Large PRs get skimmed instead of reviewed
  - Waiting for review slows small changes

example:
  scenario: A 6-person team where agents now open about 40% of all pull requests.
  steps:
    - who: Agent
      what: "Works on branch `agent/slack-retry`. It opens a PR with a 6-line description: changes, the approved plan, tests added, and one doubt: “retry delay is 30s; is that too long for the 5-minute SLA?”"
    - who: CI
      what: "Runs lint, types, 66 tests and a smoke test. All pass."
    - who: AI reviewer
      what: "Does a first pass and flags one risk: the retry isn't covered for timeouts, only for 500 errors. It points to line 48."
    - who: Developer
      what: "Reviews in 10 minutes, focusing on the flagged line and the doubt. Asks for a timeout test and a 20-second delay. The agent updates the PR, and the developer merges it."
    - who: Policy
      what: "Branch protection requires 1 human approval for agent PRs. PRs over 500 lines get an automatic comment suggesting a split."

failures:
  - failure: Giant PRs
    symptom: Reviewers skim thousands of lines and approve
    fix: Thin slices; flag PRs over a size limit
  - failure: Empty descriptions
    symptom: Reviewer has to reverse-engineer intent from the diff
    fix: Require what, why, plan, tests and doubts in every agent PR
  - failure: Review fatigue
    symptom: Approvals become automatic as agent PR volume grows
    fix: AI first pass to focus attention; rotate reviewers; track review time
  - failure: Bypassing the gate
    symptom: Agent or developer pushes straight to main "just this once"
    fix: Branch protection; no direct pushes for agent identities

related:
  - { type: Analog of, pattern: human-in-the-loop }
  - { type: Combines with, pattern: thin-slice-mvps }
  - { type: Combines with, pattern: plan-then-code }
  - { type: Enables, pattern: parallel-worktrees }
  - { type: Analog of, pattern: sandboxed-execution }
---
