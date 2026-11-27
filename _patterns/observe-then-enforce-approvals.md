---
title: Observe-Then-Enforce Approvals
n: 61
family: operating
maturity: emg
axes: [decision, verification]
intent: Write approval rules as code, tiered by risk, and run them in observe mode against real PRs before letting them block or approve anything.
aka: shadow-mode approval policy, approvals as code, risk-tiered review policy
status: full

problem: >-
  As AI review gets better, teams want to let it lighten human review on low-risk changes
  while keeping people firmly in charge of risky ones. Changing approval rules directly is
  dangerous: a rule that's too loose lets bad changes merge with no one looking, and one that's
  too strict slows every team. Opinions about which changes are safe rarely match what
  reviewers actually do, and mistakes only show up after something has shipped.
forces:
  - Different paths carry very different risk (docs versus auth or billing).
  - AI review verdicts can be swayed by text in the PR itself.
  - An AI approval may count as a real approval in branch rules.
  - Teams need evidence before trusting a looser rule.

solution: >-
  Express approval requirements as a policy file in the repository. Each rule names a purpose,
  the paths it covers, and what it needs, such as two approvals, or a human who isn't an author
  for auth, billing and CI. Changes to the review rules themselves need the strictest rule. Start
  the policy in observe mode: on every PR it records what it would have decided but approves and
  blocks nothing. After a week or two, compare its decisions with what reviewers actually did.
  Where it would have approved but reviewers asked for changes, add a human-required rule or fix
  the review checklist. Where a rule demanded two people who always approved at a glance,
  consider narrowing it. Only then switch to enforce, rerun the policy on open PRs, and make its
  check required. Teams further along let a classifier sort every change: mechanical, low
  blast-radius changes merge after automated checks, and everything else goes to a person. The
  classifier earns that right the same way, by running in observe mode first.

diagram: observe-then-enforce-approvals
diagram_caption: The policy runs in the shadow of real reviews first. Its mistakes are found and fixed before it can block or approve anything.

use_when:
  - AI review is in place and the team wants it to carry weight
  - Repos mix low-risk and high-risk paths
  - Approval rules are argued about rather than measured
  - Branch protection and required checks are available
avoid_when:
  - Teams without AI review or written review rules yet
  - Regulated paths where the human requirement is fixed by policy anyway
  - Repos with untrusted contributors, where PR text could sway AI verdicts

tradeoffs:
  latency:     { score: 2, note: "Observe period before any change in review speed" }
  cost:        { score: 2, note: "AI reviews and classifiers run even in observe mode" }
  complexity:  { score: 3, note: "Policy file, branch rules and required checks must agree" }
  reliability: { score: 5, note: "Rules are tested on real PRs before they bite" }
gains:
  - Approval rules based on evidence, not opinion
  - Human review focused on the paths that need it
  - Mistakes in the policy found before they cause harm
costs:
  - Needs an observe period and someone to analyze it
  - Policy, branch rules and auto-merge interact in subtle ways
  - Billed reviews can start just because the policy names them

example:
  scenario: The Linkwatch team wants a passing AI review to reduce routine PRs from two approvals to one, while auth and billing always need a non-author human.
  steps:
    - who: Policy
      what: "Writes three rules: everything needs 2 approvals; review rule files need 2; auth, billing and CI need 1 human who isn't an author. Sets mode to observe."
    - who: Two weeks
      what: "The policy logs decisions on 140 merged PRs. On 9 it would have approved after a passing AI review, but reviewers requested changes."
    - who: Analysis
      what: "Six of the 9 touch database migrations. The team adds a migrations path to the human-required rule and adds a migration check to the review checklist."
    - who: Narrowing
      what: "Docs-only PRs always got two instant approvals. That rule is narrowed to one approval."
    - who: Enforce
      what: "Removes observe mode, reruns the policy on open PRs, and asks an admin to make the approvals check required."

failures:
  - failure: Skipping observe
    symptom: Policy blocks or waves through PRs on day one
    fix: Always start in observe mode and review results before enforcing
  - failure: AI approval as the only approval
    symptom: Branch rules need one approval and the AI alone satisfies it
    fix: Read policy and branch rules together; keep human-required paths without overrides
  - failure: Auto-merge surprise
    symptom: PRs merge with no person having looked
    fix: Decide per path whether auto-merge is allowed and document it
  - failure: Policy edits slip through
    symptom: Someone loosens the rules in an ordinary PR
    fix: The strictest rule covers the policy and review rule files

related:
  - { type: Combines with, pattern: ai-first-pass-review }
  - { type: Combines with, pattern: protected-rule-files }
  - { type: Combines with, pattern: pr-review-gate }
  - { type: Specializes, pattern: shadow-mode-autonomy }
  - { type: Feeds, pattern: review-capacity-limits }
---
