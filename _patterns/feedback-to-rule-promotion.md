---
title: Feedback-to-Rule Promotion
n: 62
family: knowledge
maturity: emg
axes: [context]
intent: When the same review feedback appears on more than one PR, turn it into a written rule in the file the relevant agent reads, with a person approving it.
aka: codify repeated feedback, review-to-rule pipeline, rule promotion
status: full

problem: >-
  Reviewers keep writing the same comments: scope this query to the tenant, add an
  integration test for new routes, regenerate the lockfile properly. Each time, a coding agent
  fixes it in that PR and makes the same mistake in the next one, because the lesson lives only
  in a closed comment thread. Meanwhile, rule files that do exist grow without limit, collect
  rules nobody remembers the reason for, and get loaded into every agent's context.
forces:
  - One comment may be a one-off; repetition shows a real pattern.
  - Different agents read different files (conventions, review rules, verification, PR upkeep).
  - Rules cost context on every run, so stale ones have a price.
  - Agents shouldn't write the rules that govern them without a person agreeing.

solution: >-
  Watch for feedback that repeats. When a pattern appears on at least two PRs, write it down as
  a rule, in the file the tool that needs it actually reads. Coding conventions go in the project
  memory file. Review rules go in the review rules file. How to run and exercise the app goes in
  a verification skill. How PRs should be maintained goes in a PR upkeep skill. The rule arrives
  in its own small PR, which a person approves; agents may draft it but don't merge it. Each rule
  says why it exists or links to the PRs that prompted it. Rules that stop earning their place
  are deleted in the same way.

diagram: feedback-to-rule-promotion
diagram_caption: Repeated feedback is promoted into the one file that the relevant agent reads, through a small PR a person approves.

use_when:
  - Reviewers repeat the same comments across PRs
  - Agents keep reintroducing mistakes that were already fixed
  - Several rule files exist and it's unclear what goes where
  - Rule files are growing without anyone pruning them
avoid_when:
  - One-off comments; a single occurrence isn't a pattern yet
  - Preferences the team hasn't agreed on
  - Rules that a linter or test could enforce instead

tradeoffs:
  latency:     { score: 1, note: "Agents start with the rule; fewer review rounds" }
  cost:        { score: 1, note: "A small PR per rule; some context per run" }
  complexity:  { score: 2, note: "Knowing which file each kind of rule belongs in" }
  reliability: { score: 4, note: "Fixed mistakes stay fixed across PRs" }
gains:
  - Review lessons outlive the PR they came from
  - Each agent loads only the rules it needs
  - Rule files stay small and explained
costs:
  - Someone must notice repetition and write the rule
  - Wrong placement means the rule is never read
  - Rule PRs need the same care as CI changes

example:
  scenario: Over two weeks, reviewers on the Linkwatch API ask three times for database queries to be scoped to the current tenant, and twice for flaky end-to-end tests to be rerun once before investigating.
  steps:
    - who: Spot
      what: "A team member notices both comments repeating. The tenant scoping one has appeared on 3 PRs, the rerun one on 2."
    - who: Place
      what: "Tenant scoping is a review rule, so it goes in the review rules file. Rerunning a flaky job once is PR upkeep, so it goes in the PR upkeep skill."
    - who: Rule PR
      what: "An agent drafts both rules with links to the PRs that prompted them. The team member commits them in one small PR, and a second person approves."
    - who: Next PRs
      what: "AI review now flags an unscoped query before any human sees it. The PR steward reruns a flaky job once instead of rewriting a correct test."
    - who: Quarterly prune
      what: "A rule about an old logging library no longer applies after a migration. It's deleted."

failures:
  - failure: Rule sprawl
    symptom: Rule files run to hundreds of lines no one reads
    fix: Two-PR threshold; delete rules that stop being useful
  - failure: Wrong file
    symptom: Review rule placed where the reviewer never reads it
    fix: Map each kind of rule to the file its tool reads
  - failure: Agent writes its own rules
    symptom: An agent loosens a rule while fixing a PR
    fix: Rule files are protected; a person approves every change
  - failure: Rule without a reason
    symptom: Nobody knows whether a rule still applies
    fix: Each rule links to the PRs or incident that prompted it

related:
  - { type: Feeds, pattern: project-memory-file }
  - { type: Feeds, pattern: shared-knowledge-layer }
  - { type: Requires, pattern: protected-rule-files }
  - { type: Combines with, pattern: ai-first-pass-review }
  - { type: Analog of, pattern: learning-loop }
---
