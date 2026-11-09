---
title: Thin-Slice MVPs
n: 46
family: buildloop
maturity: emg
axes: [decision]
intent: Each session ships one small, working vertical slice (MVP1 → MVP2 → MVP3).
aka: vertical slices, incremental milestones, walking skeleton
status: full

problem: >-
  Coding agents can generate a lot of code quickly, which makes it tempting to ask for the
  whole application at once. The result is a large, half-working codebase: many features
  started, few finished, no way to tell which parts work, and a review nobody can complete.
  Fixing it often takes longer than building it in steps would have.
forces:
  - Agents can produce more code than a person can review in one sitting.
  - Working software gives far better feedback than plans or partial features.
  - Small slices feel slower at first.
  - Some foundations, like the data model, are costly to change later.

solution: >-
  Plan the work as a sequence of thin vertical slices, each one usable end to end: MVP1 does
  the smallest useful thing, MVP2 adds the next most valuable capability, and so on. Each
  slice gets its own spec, branch and PR, sized so one session can build, test and review it.
  A slice is done only when it runs, passes its acceptance tests and has been tried by a
  person. Learnings from each slice shape the next slice's spec, and lasting decisions go
  into the Project Memory File.

diagram: thin-slice-mvps
diagram_caption: Every slice works end to end before the next begins. Feedback from using each slice changes what goes into the next one.

use_when:
  - Building a new app or feature with a coding agent
  - Requirements are likely to change once people use the software
  - You want reviewable PRs instead of one giant change
  - Several sessions or developers will contribute over time
avoid_when:
  - Tiny tasks that are already one slice
  - Fixed, well-understood specs where the whole design is settled
  - When slices would be so thin they ship nothing a person can use

tradeoffs:
  latency:     { score: 2, note: "First usable version sooner; total time similar or less" }
  cost:        { score: 1, note: "Less rework from building the wrong thing" }
  complexity:  { score: 2, note: "Planning slices and keeping each one shippable" }
  reliability: { score: 4, note: "Each slice tested and used before building on it" }
gains:
  - Working software early, and at every step after
  - Reviews small enough to do properly
  - Real feedback steers what gets built next
costs:
  - Some rework when early slices need restructuring
  - Discipline to stop adding features to the current slice
  - Foundations need some upfront thought despite the small steps

example:
  scenario: Linkwatch is built in three slices over two weeks, one spec and one PR each.
  steps:
    - who: MVP1 · 1 session
      what: "Add URLs from a config file, run an hourly check, write failures to a log file. 8 acceptance tests. The developer runs it against 20 real URLs for two days."
    - who: Learning
      what: "Two sites block the checker's default user agent, and alerts in a log file get missed. Both go into the next spec."
    - who: MVP2 · 2 sessions
      what: "Adds Slack alerts behind a notifier interface, a custom user agent and a retry. 12 more tests. Shipped as one PR of about 400 lines."
    - who: MVP3 · 2 sessions
      what: "Adds a small web page to manage URLs and view history. The data model from MVP1 holds up because \"check results are append-only\" was decided early."
    - who: Comparison
      what: "An earlier attempt asked the agent for everything at once. It produced 3,000 lines in one go, and the developer abandoned it after a day of debugging."

failures:
  - failure: Slice creep
    symptom: Current slice keeps growing with "just one more" feature
    fix: New ideas go into the next slice's spec, not this one
  - failure: Horizontal slices
    symptom: "\"MVP1: database layer\" ships nothing anyone can use"
    fix: Every slice is usable end to end, even if minimal
  - failure: Skipping the try-it step
    symptom: Slices pass tests but nobody actually used them
    fix: A person uses each slice before the next spec is written
  - failure: Painted into a corner
    symptom: An early shortcut forces a rewrite later
    fix: Decide key foundations (data model, interfaces) in MVP1 and record them

related:
  - { type: Combines with, pattern: spec-driven-development }
  - { type: Combines with, pattern: pr-review-gate }
  - { type: Combines with, pattern: project-memory-file }
  - { type: Combines with, pattern: plan-then-code }
  - { type: Analog of, pattern: prompt-chaining }
---
