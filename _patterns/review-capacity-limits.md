---
title: Review Capacity Limits
n: 55
family: verify
maturity: emg
axes: [coordination]
intent: Cap open agent changes at what reviewers can handle, so review wait stays short instead of growing into a queue.
aka: WIP limits for agents, review throttling, review-paced delivery
status: full

problem: >-
  Coding agents can open pull requests far faster than people can review them. When nothing
  limits that, a queue builds: changes wait days, go stale, conflict with each other and get
  merged in a rush. The team produces more code but delivers no faster, and failures rise as
  reviews get shallower.
forces:
  - Agent output is limited by compute; review is limited by people.
  - Waiting changes go stale and conflict with newer ones.
  - Idle agents feel wasteful, so teams keep them busy.
  - Some changes are urgent and shouldn't wait behind routine work.

solution: >-
  Treat review as the bottleneck it is and limit work in progress to match it. Measure how
  many agent PRs your reviewers can properly handle per day, and cap the number of open
  agent PRs at roughly that level per team or repository. When the cap is reached, agents
  stop opening new PRs and instead work on things that don't need review yet: tests,
  planning the next change, or fixing comments on open PRs. Order the queue by priority, not
  arrival, with a fast lane for urgent fixes. Watch review wait time, and raise the cap only
  when reviewers or AI first-pass review add capacity.

diagram: review-capacity-limits
diagram_caption: The cap moves the queue from review, where changes go stale, to the agents' backlog, where waiting is free.

use_when:
  - Review wait time is growing as agent output grows
  - Open agent PRs often go stale or conflict
  - Teams feel busy but lead time isn't improving
  - You can measure review wait and throughput
avoid_when:
  - Review keeps up easily with current volume
  - Tiny teams where one person reviews everything in minutes
  - As a substitute for adding review capacity when demand is genuinely higher

tradeoffs:
  latency:     { score: 1, note: "Shorter review wait; changes land faster end to end" }
  cost:        { score: 1, note: "Agents sometimes idle or do other work" }
  complexity:  { score: 2, note: "A cap, a priority queue and wait-time tracking" }
  reliability: { score: 4, note: "Reviews stay thorough; fewer stale conflicts" }
gains:
  - Review wait stays short and predictable
  - Fewer stale PRs and merge conflicts
  - Makes the real bottleneck visible, so investment goes there
costs:
  - Agent capacity sits partly unused
  - Needs agreement on priorities for the queue
  - A cap that's too low slows teams for no reason

example:
  scenario: A platform team with 3 reviewers and 4 coding agents. Open agent PRs had grown to over 30, and review wait was close to a week.
  steps:
    - who: Measure
      what: "Over two weeks, reviewers properly reviewed about 8 agent PRs a day between them."
    - who: Cap
      what: "Sets a cap of 10 open agent PRs. Priority order: production fixes, then the current milestone, then cleanups."
    - who: At the cap
      what: "When 10 PRs are open, agents stop opening new ones. They add missing tests to open PRs, address review comments and write plans for the next tasks."
    - who: Fast lane
      what: "A production bug fix skips the queue and is reviewed within the hour."
    - who: Four weeks later
      what: "Review wait falls from days to under a day, and stale PRs nearly disappear. After adding AI first-pass review, reviewers handle about 12 a day, so the cap rises to 14."

failures:
  - failure: Cap ignored
    symptom: People bypass the limit for "just one more"
    fix: Enforce it in tooling; only the fast lane skips the queue
  - failure: Wrong cap
    symptom: Queue still grows, or reviewers sit idle
    fix: Set it from measured throughput and adjust monthly
  - failure: Everything is urgent
    symptom: The fast lane fills up
    fix: Strict fast-lane criteria, such as production incidents only
  - failure: Agents idle
    symptom: Paid capacity does nothing while capped
    fix: "Give agents review-free work: tests, plans, comment fixes"

related:
  - { type: Combines with, pattern: ai-first-pass-review }
  - { type: Combines with, pattern: small-change-budget }
  - { type: Combines with, pattern: parallel-worktrees }
  - { type: Measured by, pattern: delivery-dividend-metrics }
  - { type: Analog of, pattern: budget-aware-planning }
  - { type: Fed by, pattern: observe-then-enforce-approvals }
---
