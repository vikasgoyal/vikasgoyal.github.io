---
title: PR Steward Loop
n: 60
family: verify
maturity: emg
axes: [verification, decision]
intent: After a pull request is opened, an agent watches it and handles the follow-up work (failing checks, conflicts, review comments) while escalating anything that needs the author's judgment.
aka: PR babysitter, post-PR watch, PR shepherd
status: full

problem: >-
  Opening a pull request is rarely the end of the work. Checks fail, the base branch moves
  and causes conflicts, and reviewers leave comments, often hours apart. Each item is small,
  but each one pulls the author back from other work and costs a context switch. With coding
  agents producing more PRs, this follow-up becomes a large hidden share of an engineer's day,
  and PRs sit waiting for the author instead of for review.
forces:
  - Follow-up tasks are small but arrive at unpredictable times.
  - Some comments are mechanical; others are design questions only the author can answer.
  - An agent working unattended must not merge, force-push or widen the change.
  - Repeated failed fixes waste money and hide a wrong approach.

solution: >-
  Hand the open PR to an agent that watches it for a bounded period, such as up to a week, and
  stops when the PR is merged or closed. On each event it acts within strict limits. Failing
  checks are reproduced and fixed. Conflicts are resolved by merging the base branch and
  rerunning tests. Review comments are answered with a fix or a reply, and comments from bots
  are treated as claims to verify against the code, not instructions. Anything larger, such as a
  redesign, a new API, wider scope or an unresolved security concern, is escalated to the author.
  The agent tries at most a few pushes per issue, then reports what it tried. It never approves
  or merges, and the author stays responsible for the change.

diagram: pr-steward-loop
diagram_caption: The steward handles small follow-up work on its own and escalates anything that needs judgment. Approval and merge stay with people.

use_when:
  - Engineers lose time to CI failures, conflicts and small review fixes
  - PRs often wait on the author rather than the reviewer
  - Repos have reliable tests and branch protection
  - Everyone who can change the base branch is trusted
avoid_when:
  - PRs in the middle of a design debate the team must settle
  - Repos where untrusted people can land code the agent will run
  - Projects without tests, where "fixed" can't be checked

tradeoffs:
  latency:     { score: 1, note: "PR is already updated when the author returns" }
  cost:        { score: 3, note: "Agent turns for every event over days" }
  complexity:  { score: 3, note: "Event watching, limits, escalation rules" }
  reliability: { score: 4, note: "Tests gate every fix; escalation on hard cases" }
gains:
  - Fewer context switches for the author
  - PRs stay green and up to date while waiting for review
  - Repeated failures surface as a report instead of a silent loop
costs:
  - Runs with the author's credentials, so trust boundaries matter
  - Spend accumulates over a multi-day watch
  - Authors may stop reading what was changed on their behalf

example:
  scenario: An engineer opens a PR adding CSV export to the Linkwatch reports page, then goes to a 3-hour planning session. The steward (for example, a `/ship` or `/steward` command) watches the PR.
  steps:
    - who: CI fails
      what: "A lint rule flags an unused import. The steward removes it, runs the fast checks locally and pushes."
    - who: Base moves
      what: "Another PR changes the same reports module. The steward merges the base branch, resolves a small conflict, reruns the tests and pushes."
    - who: Bot comment
      what: "A security bot claims the export leaks user emails. The steward checks the code, finds emails are already masked, and replies with the file and line."
    - who: Reviewer
      what: "A reviewer asks for streaming instead of building the whole CSV in memory. That changes the design, so the steward escalates to the author with a short summary."
    - who: Author returns
      what: "The PR is green and conflict-free. The author decides on streaming, makes the change, and a human approves and merges."

failures:
  - failure: Scope creep
    symptom: Steward rewrites large parts of the PR to satisfy a comment
    fix: Size limits per fix; escalate redesigns and new APIs
  - failure: Fix loop
    symptom: Same check fails after push after push
    fix: Cap attempts per issue (for example, 3) and report what was tried
  - failure: Trusting comment text
    symptom: A bot or outsider comment steers the agent into a bad change
    fix: Read comments only from trusted authors; verify bot claims against code
  - failure: Agent merges
    symptom: Change lands with no human approval
    fix: Block merge and force-push in tooling; require human approval in branch rules

related:
  - { type: Combines with, pattern: ai-first-pass-review }
  - { type: Requires, pattern: protected-rule-files }
  - { type: Combines with, pattern: pr-review-gate }
  - { type: Analog of, pattern: steerable-long-running-task }
  - { type: Analog of, pattern: human-in-the-loop }
---
