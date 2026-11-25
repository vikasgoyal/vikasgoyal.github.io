---
title: Explicit Dividend Allocation
n: 59
family: operating
maturity: hor
axes: [decision]
intent: Decide on purpose how to spend the capacity coding agents free up, between cutting cost and building new capability, instead of letting it disappear.
aka: capacity reinvestment decision, AI dividend policy, cost vs. capability lever
status: full

problem: >-
  When coding agents make delivery cheaper, the freed capacity goes somewhere. Without a
  decision, it usually leaks away: into more meetings, larger backlogs of low-value work, or
  a quiet expectation that the same team does more of the same. Leadership may assume cost
  savings while teams assume more ambitious work, and neither happens on purpose. Months
  later nobody can say what the investment in agents bought.
forces:
  - Freed capacity is real but hard to see.
  - Cutting cost and building new things compete for the same capacity.
  - Different teams and products need different choices.
  - The choice affects people's roles, so it needs to be explicit and fair.

solution: >-
  Make the allocation a named decision, revisited each planning cycle. Using delivery
  dividend metrics, estimate how much capacity agents have freed per team. Then choose, per
  product area, how to use it: reduce cost (smaller run budgets, fewer contractors), reduce
  risk (pay down tech debt, more tests, better review), or grow capability (new products,
  features or markets). Write the split down, such as 40% capability, 40% risk, 20% cost, with
  the reasons and an owner, and communicate it to the teams affected. Review it against the
  metrics next cycle and adjust.

diagram: dividend-allocation
diagram_caption: Freed capacity is measured, then split on purpose across three levers, with an owner and a review date, instead of being absorbed by default.

use_when:
  - Agents have clearly freed capacity in several teams
  - Leadership and teams have different assumptions about the gains
  - Planning cycles exist where the decision can be made
  - Delivery dividend metrics or a similar baseline are available
avoid_when:
  - Before gains are measured; allocating guesses causes distrust
  - Very small teams where the split is a single conversation
  - As a cover for headcount decisions made elsewhere

tradeoffs:
  latency:     { score: 1, note: "A planning-cycle decision, not a runtime step" }
  cost:        { score: 1, note: "Leadership time each cycle" }
  complexity:  { score: 3, note: "Estimating freed capacity and agreeing a split" }
  reliability: { score: 4, note: "Gains go where intended and can be checked" }
gains:
  - The investment in agents has a stated purpose
  - Teams know what is expected of them
  - Results can be checked against the decision
costs:
  - Freed capacity is an estimate, not exact
  - Hard conversations about roles and priorities
  - Needs repeating every cycle as conditions change

example:
  scenario: A product group of 5 teams, six months into coding agent adoption, with metrics showing faster lead time and a stable failure rate.
  steps:
    - who: Estimate
      what: "Metrics suggest roughly a quarter of engineering time has been freed across the group, unevenly: high in the web teams, low in the data team."
    - who: Options
      what: "Leadership lists three levers: cut contractor spend (cost), clear the payments tech debt backlog (risk), or build the long-delayed partner API (capability)."
    - who: Decide
      what: "For the next two quarters: 50% capability (partner API), 35% risk (payments debt), 15% cost (one contractor team not renewed). Each lever gets an owner."
    - who: Communicate
      what: "The decision, its reasons and the review date are shared with all 5 teams in the planning meeting."
    - who: Review
      what: "Next cycle, the partner API is in beta and payments incidents are down. The split shifts toward capability for the following cycle."

failures:
  - failure: Silent absorption
    symptom: Nobody can say what the gains were spent on
    fix: Name the decision and its owner each planning cycle
  - failure: Hidden agenda
    symptom: Teams assume cuts and resist adoption
    fix: Publish the split and reasons openly
  - failure: Allocating guesses
    symptom: Plans based on gains that never materialized
    fix: Decide from measured metrics, not vendor claims
  - failure: One-size-fits-all
    symptom: Same split for teams with very different gains
    fix: Allocate per product area, from per-team metrics

related:
  - { type: Fed by, pattern: delivery-dividend-metrics }
  - { type: Analog of, pattern: budget-aware-planning }
  - { type: Combines with, pattern: review-capacity-limits }
  - { type: Combines with, pattern: thin-slice-mvps }
  - { type: Combines with, pattern: observe-then-enforce-approvals }
---
