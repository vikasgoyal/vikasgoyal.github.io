---
title: Debate / Multi-Critic
n: 12
family: multi
maturity: est
axes: [verification, coordination]
intent: Agents argue from different viewpoints and a judge picks the answer.
aka: multi-agent debate, red team / blue team, panel of critics
status: full

problem: >-
  For judgment calls like architecture choices, risk assessments or investment cases, one
  model tends to settle on the first plausible answer and then defend it. A single critic
  adds a second view but often shares the same blind spots. Important decisions need their
  weak points pressed from several directions.
forces:
  - Different viewpoints surface risks a single perspective misses.
  - Agents prompted to disagree can argue for the sake of it.
  - Agents also drift toward agreeing with each other over rounds.
  - Every round and every participant adds cost and latency.

solution: >-
  Give two or more agents distinct, explicit viewpoints, such as proposer and skeptic, or
  security, cost and user-experience critics. Each states its position with evidence, then
  responds to the others for a fixed number of rounds. A separate judge, who didn't take part,
  reads the exchange against stated criteria. It picks a position or writes a synthesis,
  lists the strongest unresolved objection, and says how confident it is. Different models
  for different seats reduce shared blind spots.

diagram: debate
diagram_caption: Viewpoints are assigned, not left to chance. The judge didn't argue, and it reports the strongest objection that was left unresolved.

use_when:
  - High-stakes judgment calls with real trade-offs
  - You want risks surfaced before a decision, not after
  - Criteria for a good decision can be written down for the judge
  - The output feeds a human decision-maker, not an automatic action
avoid_when:
  - Questions with a checkable right answer; verify instead
  - Routine, low-stakes decisions where cost isn't justified
  - You can't define distinct viewpoints, so agents just echo each other

tradeoffs:
  latency:     { score: 4, note: "Several agents over 2–3 rounds, plus a judge" }
  cost:        { score: 4, note: "Participants × rounds, plus the judge" }
  complexity:  { score: 3, note: "Role prompts, round control and judge criteria" }
  reliability: { score: 4, note: "Surfaces risks; judge quality is the limit" }
gains:
  - Exposes weak points and assumptions before a decision
  - The transcript shows decision-makers the strongest case on each side
  - Reduces single-model overconfidence on judgment calls
costs:
  - Expensive per decision
  - Debaters can converge too early or argue past each other
  - A weak judge can pick the most persuasive answer, not the best one

example:
  scenario: A platform team must choose between building an agent memory service in-house or adopting a managed vector database.
  steps:
    - who: Proposer (build)
      what: "Argues for full control over retention rules, no per-query fees and an easier fit with internal identity."
    - who: Skeptic (buy)
      what: "Counters that the build needs 2 engineers for about 6 months plus on-call, and that the managed service already meets the compliance requirements."
    - who: Security critic
      what: "Points out that neither side addressed deletion within 30 days, which the customer contracts require. It asks both to show how they'd meet it."
    - who: Round 2
      what: "The Proposer shows a design for 30-day deletion. The Skeptic finds the managed service supports it but only in one region."
    - who: Judge
      what: "Recommends buying for the next 12 months with a migration checkpoint, at medium confidence. Strongest unresolved objection: single-region deletion support may block EU customers."

failures:
  - failure: Fake consensus
    symptom: Agents agree by round 2 regardless of the topic
    fix: Assign firm positions; use different models for different seats
  - failure: Argument for its own sake
    symptom: Critics invent weak objections to fill their role
    fix: Require evidence or a concrete scenario for each objection
  - failure: Persuasion beats truth
    symptom: Judge picks the most fluent side
    fix: Give the judge explicit criteria; ask it to list unresolved points
  - failure: Endless rounds
    symptom: Debate repeats itself without new information
    fix: Fixed round limit; stop early when no new points appear

related:
  - { type: Alternative, pattern: evaluator-optimizer }
  - { type: Alternative, pattern: parallelization }
  - { type: Combines with, pattern: llm-as-judge }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: reflection }
---
