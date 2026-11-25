---
title: Protected Rule Files
n: 63
family: verify
maturity: emg
axes: [tool]
intent: Agents can't commit changes to the files that govern them (review rules, CI, ownership, agent instructions); those changes need extra human approval.
aka: self-modification lock, governance file protection, rules-are-code-owned
status: full

problem: >-
  Coding agents work under rules kept in the repository: the project memory file, review
  rules, CI workflows, code-owner lists, approval policies and git hooks. If an agent can edit
  those files as part of ordinary work, a fix can quietly loosen the checks that were meant to
  catch it, such as skipping a failing test in CI or deleting a review rule that kept flagging
  its change. A comment or PR text can also nudge an agent into doing exactly that.
forces:
  - Rule files sit in the same repo agents are allowed to change.
  - Some legitimate tasks do require editing CI or agent instructions.
  - Anyone who can merge can edit these files, so the risk isn't only agents.
  - Checks an agent can turn off are not checks.

solution: >-
  Treat the files that govern agents as protected. Unattended agents are blocked in tooling
  from committing to them: agent instruction files, review rules, approval policy, CI workflows,
  code-owner lists and git hooks. When a change to them is genuinely needed, a person commits it
  in its own PR, and the approval policy requires stricter review for those paths, such as two
  people or a code owner. Enforce required checks in CI and branch rules rather than in local
  hooks an agent's commits can skip. Review changes to these files with the same care as CI
  changes.

diagram: protected-rule-files
diagram_caption: Agents can change the code but not the rules that judge the code. Rule changes take a separate, stricter path.

use_when:
  - Agents commit to repos unattended
  - Review rules, CI or agent instructions live in the repo
  - Approval or review policies rely on files in the repo
  - Agents read PR comments that outsiders can write
avoid_when:
  - Repos where agents only suggest changes and never commit
  - When the protection would also block the people who maintain CI; give them a clear path instead

tradeoffs:
  latency:     { score: 2, note: "Rule changes need a separate PR and stricter review" }
  cost:        { score: 1, note: "Tooling blocks and an approval rule" }
  complexity:  { score: 2, note: "List the protected paths; keep the list current" }
  reliability: { score: 5, note: "Checks can't be loosened by the work they check" }
gains:
  - Agents can't weaken the checks on their own work
  - Rule changes are visible and deliberate
  - Limits injected through comments or PR text have less reach
costs:
  - Slower edits to CI and rule files
  - Protected path lists need upkeep
  - Can frustrate legitimate maintenance if the human path is unclear

example:
  scenario: A PR steward is fixing a failing integration test on a Linkwatch PR. The test times out in CI.
  steps:
    - who: Steward
      what: "After two attempts, the fastest way to green is raising the CI timeout in the workflow file. The tooling blocks the commit because the workflow file is protected."
    - who: Escalate
      what: "The steward reports to the author: the test is slow because of a missing index, and raising the timeout would need a person."
    - who: Author
      what: "Adds the index instead. The test passes within the original timeout."
    - who: Later
      what: "A platform engineer does want a longer timeout for a different job. She commits it in its own PR, and the approval policy requires a second person for `.github/` paths."

failures:
  - failure: Incomplete list
    symptom: Agent edits a hook or policy file that wasn't listed
    fix: Protect by folder, such as all of `.github/` and agent config folders
  - failure: Local-only enforcement
    symptom: Checks live in git hooks that agent commits bypass
    fix: Enforce required checks in CI and branch rules
  - failure: Human bypass
    symptom: Rule changes ride along in a large feature PR
    fix: Approval policy requires stricter review for rule paths
  - failure: Blocked maintenance
    symptom: Nobody knows how to change CI legitimately
    fix: Document the human path for rule changes

related:
  - { type: Analog of, pattern: guardrails }
  - { type: Analog of, pattern: bounded-autonomy }
  - { type: Combines with, pattern: observe-then-enforce-approvals }
  - { type: Enables, pattern: pr-steward-loop }
  - { type: Combines with, pattern: feedback-to-rule-promotion }
---
