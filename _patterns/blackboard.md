---
title: Blackboard
n: 13
family: multi
maturity: est
axes: [coordination, context]
intent: Agents read and write a shared workspace and contribute when they can.
aka: shared workspace, shared state board, stigmergy
status: full

problem: >-
  Some problems are solved by many partial contributions that build on each other, in an
  order nobody can plan. An investigation, a diagnosis or a complex document grows as each
  finding unlocks the next. A fixed pipeline or a central planner can't anticipate which
  specialist will be useful next.
forces:
  - The order of useful contributions depends on what has been found so far.
  - Specialists should be able to join or leave without rewiring the system.
  - A shared space can fill with noise and conflicting entries.
  - Several agents writing at once can overwrite each other.

solution: >-
  Keep a shared, structured workspace, the blackboard, that holds the current state of the
  problem: facts, hypotheses, open questions and decisions, each with its author and
  evidence. Specialist agents watch the board and each acts when it sees something it can
  contribute to, such as a new fact in its domain or an open question it can answer. A
  lightweight controller decides which ready agent goes next and when the problem is
  solved. Agents never call each other; they coordinate only through the board.

diagram: blackboard
diagram_caption: Agents never call each other. The board is the only channel, so every contribution is visible, attributed and auditable.

use_when:
  - Investigations or diagnoses where findings unlock each other unpredictably
  - Many specialists may contribute, and the set changes over time
  - You want a full, attributed record of how the answer was reached
  - Agents run at different speeds or on different schedules
avoid_when:
  - The steps are known in advance; use a pipeline or Plan-and-Execute
  - Only two or three agents with a fixed order are involved
  - Strict latency budgets; board-driven progress is hard to predict

tradeoffs:
  latency:     { score: 4, note: "Progress depends on which contributions arrive when" }
  cost:        { score: 3, note: "Agents only act when relevant, but may check often" }
  complexity:  { score: 4, note: "Board schema, write conflicts and a stop rule" }
  reliability: { score: 4, note: "Full record; evidence attached to each entry" }
gains:
  - Specialists can be added or removed without rewiring the others
  - A complete, attributed record of how the conclusion formed
  - Handles problems where the next step can't be planned
costs:
  - The board schema needs careful design up front
  - Noise builds up without pruning and confidence rules
  - Concurrent writes need locking or versioning

example:
  scenario: An incident-response system investigates why checkout latency jumped from 300 ms to 2.4 seconds.
  steps:
    - who: Metrics agent
      what: "Posts a fact: latency spike began at 14:02 and affects only the EU region. It attaches the dashboard link."
    - who: Deploy agent
      what: "Sees the timestamp and posts that a payment-service release went to EU at 14:00. It adds a hypothesis: the release caused the spike."
    - who: Logs agent
      what: "Picks up the hypothesis and posts that payment-service timeout errors rose 40× after 14:01, all calling a fraud-check API."
    - who: Dependencies agent
      what: "Sees the fraud-check API mentioned and posts that its config changed in the release, with the timeout raised from 500 ms to 2 s."
    - who: Controller
      what: "Marks the problem solved with high confidence and every link backed by evidence. It drafts the incident summary and proposes rolling back the config. A human approves the rollback."

failures:
  - failure: Board noise
    symptom: Weak hypotheses pile up and distract other agents
    fix: Confidence scores, evidence requirements and pruning of stale entries
  - failure: Write conflicts
    symptom: Two agents overwrite or contradict each other's entries
    fix: Append-only entries with versions; resolve conflicts explicitly
  - failure: Stalled board
    symptom: No agent sees anything it can act on
    fix: Controller posts targeted open questions or asks a human
  - failure: Never-ending investigation
    symptom: Agents keep adding detail after the answer is clear
    fix: Explicit stop criteria checked by the controller

related:
  - { type: Alternative, pattern: orchestrator-workers }
  - { type: Alternative, pattern: hierarchical-supervisor }
  - { type: Combines with, pattern: tiered-memory }
  - { type: Combines with, pattern: ambient-agents }
  - { type: Combines with, pattern: talker-reasoner }
---
