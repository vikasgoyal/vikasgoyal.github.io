---
title: Delivery Dividend Metrics
n: 57
family: observe
maturity: hor
axes: [verification]
intent: Baseline a few delivery measures before adopting coding agents and track them after, so you know what the agents actually changed.
aka: AI delivery scorecard, before-and-after baseline, outcome metrics for coding agents
status: full

problem: >-
  Teams adopt coding agents and then judge them by activity: lines written, PRs opened,
  suggestions accepted. Those numbers always go up, yet they say nothing about whether
  software reaches users faster, breaks less, or costs less to build. Without a baseline
  taken before the change, nobody can tell a real improvement from more busywork, and
  spending decisions are made on anecdotes.
forces:
  - Activity metrics are easy to collect and flattering.
  - Outcome metrics need history from before the change.
  - Teams change several things at once, which blurs cause and effect.
  - Metrics that become targets get gamed.

solution: >-
  Pick a small, fixed set of outcome measures and record a baseline before rolling out
  agents: lead time from first commit to production, review wait, change failure rate, agent
  and tooling spend per delivered change, and the share of engineering time going to new work
  versus maintenance. Track the same measures monthly afterwards, per team, and compare
  against the baseline and against teams that haven't adopted yet. Report them together so
  a gain in one isn't hiding a loss in another. Use the results to decide where to invest,
  such as more review capacity or better tests, rather than to rank individuals.

diagram: delivery-dividend-metrics
diagram_caption: Five outcome measures, baselined before adoption and read together after it. Activity counts are deliberately left out.

use_when:
  - Rolling out coding agents across several teams
  - Leaders need to decide where to invest next
  - Claims about productivity gains conflict
  - You can still capture a baseline before the change
avoid_when:
  - Single-developer projects where the overhead outweighs the insight
  - As a ranking or performance tool for individuals
  - When the data sources (deploys, incidents, spend) aren't trustworthy yet

tradeoffs:
  latency:     { score: 1, note: "No effect on delivery itself" }
  cost:        { score: 2, note: "Data collection and a monthly review" }
  complexity:  { score: 3, note: "Joining deploy, incident, review and spend data" }
  reliability: { score: 4, note: "Decisions rest on outcomes, not anecdotes" }
gains:
  - Shows whether agents improve delivery, not just activity
  - Points to the real bottleneck, often review or tests
  - Gives a fair basis for spending decisions
costs:
  - Needs a baseline captured before rollout
  - Data plumbing across several tools
  - Results take months to become meaningful

example:
  scenario: An engineering group of 6 teams plans to roll out coding agents team by team over two quarters.
  steps:
    - who: Baseline
      what: "Records three months of history per team: median lead time, review wait, change failure rate, tooling spend per change and new-work share."
    - who: Rollout
      what: "Two teams adopt agents first; the other four continue as before for one quarter and act as the comparison."
    - who: Month 3
      what: "Adopting teams show shorter lead time, but review wait has doubled and change failure rate is slightly up. Activity metrics alone would have looked like pure success."
    - who: Decision
      what: "Instead of adding more agents, the group invests in AI first-pass review and review capacity limits."
    - who: Month 6
      what: "Review wait returns to baseline, failure rate drops below it, and new-work share rises. The remaining teams adopt with the review changes in place from day one."

failures:
  - failure: Activity as success
    symptom: Reports celebrate PR counts and lines of code
    fix: Report only the outcome set, always together
  - failure: No baseline
    symptom: Can't tell whether anything improved
    fix: Capture history before rollout; use non-adopting teams as comparison
  - failure: Gaming
    symptom: PRs split artificially to cut lead time
    fix: Use metrics for team decisions, never individual targets
  - failure: One number wins
    symptom: Faster delivery hides a rising failure rate
    fix: Read the five measures as a set; flag any that worsen
  - failure: Runaway loop spend
    symptom: Long agent loops burn budget on low-value rounds
    fix: Track spend per loop and per scenario; pause loops that stop improving

related:
  - { type: Measures, pattern: review-capacity-limits }
  - { type: Feeds, pattern: dividend-allocation }
  - { type: Combines with, pattern: production-feedback-loop }
  - { type: Analog of, pattern: llm-as-judge }
  - { type: Analog of, pattern: learning-loop }
---
