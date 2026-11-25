---
title: Small-Change Budget
n: 54
family: verify
maturity: emg
axes: [decision, verification]
intent: Cap how large each agent change can be, so every change stays reviewable and easy to roll back.
aka: PR size limit, change budget, small batches
status: full

problem: >-
  An agent can rewrite twenty files as easily as two. Large changes are slow and hard to
  review, so reviewers skim them; when they fail in production, it's hard to tell which part
  caused it, and rolling back undoes good work along with the bad. The speed agents gain
  writing code is lost in review queues and failed releases.
forces:
  - Agents have no natural sense of how big a change should be.
  - Review quality drops sharply as change size grows.
  - Some changes are genuinely large, like migrations or upgrades.
  - Splitting work has a cost in coordination and more PRs.

solution: >-
  Set an explicit size budget for agent changes, such as a maximum number of changed lines
  or files, excluding generated files and tests. Put the budget in the project memory file so
  the agent plans to it, and enforce it in CI with a check that labels or blocks oversized
  PRs. When a task is bigger than the budget, the agent splits it into a stack of small,
  independently mergeable changes, each with its own description, behind feature flags if
  needed. Genuinely large mechanical changes, like a rename across the codebase, get an
  explicit exception with their own review approach.

diagram: small-change-budget
diagram_caption: The budget shapes the plan, not just the PR. Big tasks become a stack of small changes that each pass review and roll back on their own.

use_when:
  - Agent PRs are often too large to review properly
  - Failed releases are hard to diagnose or roll back
  - Review waits grow as agents produce more code
  - Feature flags or a similar way to ship incomplete work exist
avoid_when:
  - Mechanical changes like codemods; review them by sampling instead
  - Teams without CI, where the check can't be enforced
  - Splitting would create changes that can't work on their own

tradeoffs:
  latency:     { score: 2, note: "More PRs, but each is reviewed quickly" }
  cost:        { score: 1, note: "A CI check and a rule in the memory file" }
  complexity:  { score: 2, note: "Splitting tasks, stacked PRs, feature flags" }
  reliability: { score: 5, note: "Reviewable changes and precise rollbacks" }
gains:
  - Each change gets a real review instead of a skim
  - Failures point to a small change and roll back cleanly
  - Steadier flow through review instead of large batches
costs:
  - More PRs to track and merge in order
  - Feature flags add their own complexity
  - Arbitrary limits can split work at awkward points

example:
  scenario: A team sets a budget of 400 changed lines per PR, excluding tests and generated files, after agent PRs kept stalling in review.
  steps:
    - who: Task
      what: "“Add multi-currency support to invoicing.” The agent's plan estimates about 1,500 lines."
    - who: Agent plan
      what: "Splits it into 5 stacked PRs: currency model, conversion service, invoice calculation, PDF rendering, and a feature flag to turn it on. Each is under 400 lines."
    - who: CI check
      what: "A sixth PR the agent opens later reaches 620 lines when it pulls in an unrelated cleanup. The check labels it `over-budget` and blocks merging until it's split."
    - who: Review
      what: "Each PR is reviewed in under an hour. One problem in the conversion rounding is caught in PR 2, before anything depends on it."
    - who: Release
      what: "The flag is turned on for 5% of customers. An issue in PDF rendering is fixed by reverting only PR 4."

failures:
  - failure: Budget gamed
    symptom: Work split into pieces that don't make sense alone
    fix: Each change must build, pass tests and be reviewable on its own
  - failure: Hidden in exceptions
    symptom: Large changes routinely marked as exceptions
    fix: Exceptions need a named reviewer and a reason; track how often they're used
  - failure: Stack drift
    symptom: Later PRs in a stack conflict with changes to earlier ones
    fix: Merge in order; rebase the stack after each merge
  - failure: Half-shipped features
    symptom: Partial work visible to users
    fix: Feature flags until the last change of the stack lands

related:
  - { type: Combines with, pattern: pr-review-gate }
  - { type: Combines with, pattern: thin-slice-mvps }
  - { type: Combines with, pattern: ai-first-pass-review }
  - { type: Combines with, pattern: review-capacity-limits }
  - { type: Enforced through, pattern: project-memory-file }
---
