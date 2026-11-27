---
title: Work-Type Routing
n: 74
family: operating
maturity: emg
axes: [decision]
intent: Classify each piece of work by type and risk, then run it through the workflow agreed for that type.
aka: shape per work type, adaptive workflow, pathway selection
status: full

problem: >-
  Teams often adopt one AI workflow for everything. A typo fix goes through a spec, plan approval
  and two reviews, while a risky billing change gets the same light touch as a UI tweak. A single
  workflow either slows simple work or under-protects risky work, and usually both.
forces:
  - Different work needs different rigor.
  - Choosing a workflow for every item takes time.
  - Too many workflows confuse people and agents.
  - Labelling risky work as simple is the costly mistake.

solution: >-
  Agree a small set of work types, such as new feature, greenfield system and defect fix, and a
  shape for each: which stages run, how deep, who or what does each one, and which gates apply.
  Write the shapes in a file the agents read. When work arrives, an agent proposes its type and
  risk from the ticket, using a few attributes (how clear "done" is, how verifiable it is, its
  blast radius, how novel it is), and a person confirms with one click. The work then follows
  that shape. Paths such as auth and billing always move work to a stricter shape. Review the mix
  and any mislabels every month.

diagram: work-type-routing
diagram_caption: Rigor follows the work. Simple fixes move fast, and anything touching risky paths is forced onto the strict shape.

use_when:
  - Teams with a varied mix of work
  - AI workflows that feel heavy for small items
  - Repos that mix low-risk and high-risk paths
  - Teams designing their own AI-native delivery process
avoid_when:
  - Teams doing essentially one kind of work
  - Very small teams where judgment per item is enough
  - Before basic tests and review gates exist

tradeoffs:
  latency:     { score: 1, note: "One classification step per item" }
  cost:        { score: 1, note: "A cheap agent call per ticket" }
  complexity:  { score: 2, note: "Shapes file, path rules, monthly review" }
  reliability: { score: 4, note: "Rigor matched to risk" }
gains:
  - Simple work isn't slowed by heavy process
  - Risky work always gets the strict path
  - A shared vocabulary for how the team works
costs:
  - Shapes need agreeing and maintaining
  - Misclassification risk if path rules are missing
  - Can drift into bureaucracy if confirmation isn't quick

example:
  scenario: The Linkwatch team defines three shapes, with path rules for billing and auth.
  steps:
    - who: Ticket A
      what: "\"Invoice totals round wrong.\" The agent proposes defect fix; the `/billing` path rule raises blast radius to high, so it gets the gated shape: failing test first, human approves the merge."
    - who: Ticket B
      what: "\"Add CSV export.\" New feature shape: short spec, plan approval, AI first-pass review, then human review."
    - who: Ticket C
      what: "\"Typo on settings page.\" Light defect shape: agent-led, automated checks, quick review."
    - who: Month 1
      what: "62% defect fixes, 30% features, 8% greenfield. Three tickets were mislabelled as light; a path rule is added so anything under `/payments` is high blast radius."

failures:
  - failure: Risk mislabelled
    symptom: A risky change takes the light path
    fix: Path rules force the strict shape regardless of label
  - failure: Too many shapes
    symptom: People can't remember which applies
    fix: Cap at three to five shapes
  - failure: Bureaucracy
    symptom: Classification becomes a meeting
    fix: The agent proposes; a person confirms with one click
  - failure: Frozen shapes
    symptom: Shapes no longer match how the team works
    fix: Review the mix and mislabels monthly

related:
  - { type: Analog of, pattern: routing }
  - { type: Combines with, pattern: observe-then-enforce-approvals }
  - { type: Combines with, pattern: plan-then-code }
  - { type: Combines with, pattern: small-change-budget }
  - { type: Feeds, pattern: delivery-dividend-metrics }
---
