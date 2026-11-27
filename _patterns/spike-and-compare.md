---
title: Spike-and-Compare Prototypes
n: 69
family: plan
maturity: emg
axes: [decision, coordination]
intent: Have agents build two or three rough versions of a design choice, then decide with evidence instead of debate.
aka: prototype bake-off, competing spikes, set-based design
status: full

problem: >-
  Design choices such as which library, sync or async, or which data model used to be debated
  in meetings, because building the alternatives cost too much. Coding agents make rough
  prototypes cheap, but teams often keep debating anyway, or they adopt the first thing an
  agent built as the design without comparing it to anything.
forces:
  - Debates are slow and tend to settle on opinion or seniority.
  - An agent's first attempt anchors the team.
  - Prototypes are cheap, but evaluating them still takes people's time.
  - Throwaway code has a habit of becoming production code.

solution: >-
  Frame the decision as a question with two or three named options and a short list of
  criteria, measured by the same test or benchmark. Write the criteria before any code exists.
  Give each option to a separate agent run with the same timebox and the same instructions apart
  from the option itself. Each run produces a minimal working spike and a one-page result:
  numbers against the criteria, problems hit, and code size. The team compares the results,
  picks one, records the decision and the evidence, and deletes the losing spikes. The winner is
  rebuilt properly from a spec rather than promoted as it stands.

diagram: spike-and-compare
diagram_caption: Agents make alternatives cheap; the team's job shifts from arguing about options to judging measured results.

use_when:
  - A design choice with real alternatives and measurable criteria
  - Greenfield systems or new components
  - A disagreement that won't settle by discussion
  - Options can be prototyped in hours, not weeks
avoid_when:
  - Cheap, easily reversed choices; just pick one
  - Criteria that a spike can't measure, such as long-term maintainability
  - An organization standard already dictates the answer

tradeoffs:
  latency:     { score: 2, note: "Hours of parallel agent work before deciding" }
  cost:        { score: 2, note: "Two or three agent runs, mostly thrown away" }
  complexity:  { score: 2, note: "A shared harness and written criteria" }
  reliability: { score: 4, note: "Decisions rest on measured results" }
gains:
  - Design decisions backed by evidence, not opinion
  - Less anchoring on the first idea
  - Faster resolution of team disagreements
costs:
  - Evaluating spikes still takes senior time
  - Spikes test only what they can measure in hours
  - Discipline needed to delete the losing code

example:
  scenario: The Linkwatch team is designing a new click-analytics service and can't agree how to ingest events.
  steps:
    - who: Question
      what: "Three options: write to the database directly, put events on a queue, or batch them to files. Criteria: sustain 5,000 events per second, 95th-percentile ingest under 50 ms, and low operational burden."
    - who: Spikes
      what: "Three agent runs in separate worktrees, each with a 3-hour timebox and the same load-test harness."
    - who: Results
      what: "Direct writes: 180 ms at 5,000 events per second. Queue: 22 ms. Files: 9 ms, but a 60-second delay that breaks the live dashboard."
    - who: Decision
      what: "The team picks the queue and writes a short decision record citing the numbers. The other two spikes are deleted."
    - who: Build
      what: "A spec is written from what the winning spike taught them, and an agent builds the production version test-first."

failures:
  - failure: Unequal spikes
    symptom: One option got more time or better instructions
    fix: Same timebox, harness and instructions for every option
  - failure: Criteria after the fact
    symptom: Criteria chosen to favor the preferred option
    fix: Write the criteria before any spike runs
  - failure: Spike shipped
    symptom: Prototype code ends up in production
    fix: Delete spikes and rebuild the winner from a spec
  - failure: Too many options
    symptom: Evaluation takes longer than the debate it replaced
    fix: Cap the comparison at three options

related:
  - { type: Combines with, pattern: parallel-worktrees }
  - { type: Next step, pattern: spec-driven-development }
  - { type: Combines with, pattern: thin-slice-mvps }
  - { type: Analog of, pattern: model-council }
  - { type: Analog of, pattern: parallelization }
---
