---
title: Invariant-Anchored Goals
n: 66
family: plan
maturity: emg
axes: [decision, context]
intent: Give a long-running coding agent an outcome to reach and a short list of fixed invariants, instead of a task list, and keep both in front of it every round.
aka: outcome-level prompting, goal + invariants contract, anti-drift anchor
status: full

problem: >-
  Long agent loops run for hundreds of rounds, with context compacted many times along the
  way. Given a list of tasks, the agent finishes them and stops, or keeps going and slowly
  loses the point: it optimizes a side metric, relaxes a requirement to make progress, or
  forgets a constraint stated on day one. People end up restating the goal again and again,
  which defeats the purpose of a long-running loop.
forces:
  - Outcomes are what matter, but agents work in concrete steps.
  - Context compaction can drop early instructions.
  - Some requirements must never be traded away, even for progress.
  - Too many constraints make the goal unclear.

solution: >-
  State the goal at the level of the outcome ("handle launch traffic with no lost edits"), not
  as tasks, and pair it with a short list of invariants that must always hold. Make each
  invariant checkable, ideally by a test or a metric the agent can read itself. Keep the goal and
  invariants in a fixed file or block that is reloaded at the start of every round and survives
  compaction. Every proposed change is checked against them, and a change that breaks one is
  rejected however much it helps elsewhere. Only a person can change the list, and changes are
  recorded.

diagram: invariant-anchored-goals
diagram_caption: The outcome and invariants are reloaded every round, so the agent's steps can change freely while the target can't.

use_when:
  - Agent loops that run for many rounds or days
  - Work where the steps aren't known in advance
  - A few requirements must never be traded off
  - Earlier long runs drifted or needed the goal restated
avoid_when:
  - Short, well-defined tasks; a spec or plan is enough
  - When the invariants can't be checked, only described
  - Exploratory work where the goal itself is still being found

tradeoffs:
  latency:     { score: 1, note: "Small check per round" }
  cost:        { score: 1, note: "A few hundred tokens reloaded each round" }
  complexity:  { score: 2, note: "Writing outcomes and checkable invariants" }
  reliability: { score: 5, note: "Long runs stay on target" }
gains:
  - Agents choose their own steps toward a fixed target
  - Drift is caught by checks, not by people rereading logs
  - Hard requirements can't be traded for progress
costs:
  - Writing good invariants takes thought up front
  - Vague invariants give false confidence
  - Too many invariants slow progress

example:
  scenario: The Linkwatch team starts a two-week hardening loop on its link service.
  steps:
    - who: Outcome
      what: "\"Handle 20× today's peak traffic on staging without breaking any invariant.\""
    - who: Invariants
      what: "3 checkable rules: 95th-percentile page load under 300 ms; zero lost saves in the persistence test; recovery from a node restart in under 30 seconds."
    - who: Every round
      what: "The goal file is reloaded first. After each fix, the persistence test and latency check run automatically."
    - who: Day 6
      what: "The agent finds that batching saves would cut database load a lot, but the persistence test shows saves can be lost on a crash. It rejects the change and looks for another approach."
    - who: Day 9
      what: "The tech lead raises the latency limit to 350 ms for one rare page type. The change is recorded in the goal file with the reason."

failures:
  - failure: Task list instead of outcome
    symptom: Agent finishes the list and stops, or does tasks that don't matter
    fix: State the outcome; let the agent choose the steps
  - failure: Uncheckable invariants
    symptom: '"Must be fast" means whatever the agent decides'
    fix: Tie each invariant to a test or metric with a threshold
  - failure: Lost in compaction
    symptom: Agent forgets a constraint after many rounds
    fix: Reload the goal file at the start of every round
  - failure: Agent edits the goal
    symptom: Invariant quietly relaxed to make progress
    fix: Only a person changes the list; changes are logged

related:
  - { type: Analog of, pattern: spec-driven-development }
  - { type: Enables, pattern: chaos-hardening-loop }
  - { type: Combines with, pattern: steerable-long-running-task }
  - { type: Combines with, pattern: context-compaction }
  - { type: Combines with, pattern: protected-rule-files }
---
