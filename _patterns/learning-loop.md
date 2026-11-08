---
title: Self-Improving Learning Loop
n: 31
family: eval
maturity: hor
axes: [context]
intent: Feedback and outcomes become updated memory, skills or prompts over time.
aka: agent feedback loop, continuous improvement loop, closed-loop learning
status: full

problem: >-
  Most agents ship and then stay the same until an engineer rewrites a prompt. Meanwhile
  users correct them, reject drafts, rate answers and work around the same mistakes every
  day. All that signal is lost, so the agent never gets better at the specific work it
  actually does.
forces:
  - Users give constant feedback, mostly implicit (edits, rejections, rework).
  - Changing an agent automatically risks making it worse.
  - Feedback is noisy, and one user's preference isn't everyone's.
  - Improvements must be explainable and reversible.

solution: >-
  Capture feedback from every run: explicit ratings, edits users make to outputs, rejected
  actions, and downstream outcomes like a reply that resolved the ticket. Group the signals
  into recurring lessons, such as "users always shorten the intro" or "agent misreads
  fiscal-year dates". Turn each lesson into the cheapest fitting change: a memory entry for
  one user, a prompt or skill update for everyone, or training data at scale. Every change
  is proposed, evaluated against a test set, approved, versioned and can be rolled back.

diagram: learning-loop
diagram_caption: The loop runs on evidence, not single complaints. Every change passes an evaluation gate and can be rolled back.

use_when:
  - The agent runs often enough to generate steady feedback
  - Users edit or correct outputs in ways you can capture
  - You have an evaluation set to test changes before rollout
  - Improvement over weeks matters more than perfection on day one
avoid_when:
  - Low volume, so feedback is too sparse to learn from
  - No evaluation gate; automatic changes would be untested
  - Regulated settings where behavior changes need formal re-approval each time

tradeoffs:
  latency:     { score: 1, note: "Runs offline; no effect on response time" }
  cost:        { score: 2, note: "Logging, analysis and periodic eval runs" }
  complexity:  { score: 4, note: "Capture, clustering, change types, eval gate, rollback" }
  reliability: { score: 3, note: "Steady gains when gated; risk of learning noise" }
gains:
  - The agent gets better at the actual work it does
  - Users see their corrections stick
  - Clear record of what changed, why and with what effect
costs:
  - Needs a pipeline and an owner, not just a prompt
  - Can learn the wrong lesson from noisy or biased feedback
  - Personal and shared lessons have to be kept apart

example:
  scenario: A personal assistant drafts weekly status updates for a team of 12 managers.
  steps:
    - who: Capture
      what: "Over 4 weeks, it logs 48 drafts and the managers' edits. Edits are compared with the original drafts automatically."
    - who: Cluster
      what: "Finds two lessons. 9 of 12 managers delete the opening paragraph, so that's a shared lesson. One manager always converts bullets into a table, which is a personal one."
    - who: Change
      what: "The shared lesson becomes a prompt update: start with the top 3 outcomes, no preamble. The personal lesson becomes a memory entry for that manager only."
    - who: Eval gate
      what: "The prompt update is tested on 40 past weeks. The rubric judge scores it higher on conciseness with no drop in completeness. A team lead approves it as version 4."
    - who: Result
      what: "Average edit size falls from 34% of the draft to 12% over the next month. Version 3 stays available for rollback."

failures:
  - failure: Learning from noise
    symptom: One loud user's preference changes behavior for everyone
    fix: Require a pattern across users before a shared change
  - failure: Ungated changes
    symptom: An automatic update quietly makes things worse
    fix: Every change passes evals and approval; versioned rollback
  - failure: Personal vs. shared mix-up
    symptom: One user's style imposed on others
    fix: Separate personal memory from shared prompt and skill changes
  - failure: Only explicit feedback
    symptom: Few ratings, so little learning
    fix: Capture implicit signals like edits, rework and outcomes

related:
  - { type: Uses, pattern: llm-as-judge }
  - { type: Uses, pattern: tiered-memory }
  - { type: Generalizes, pattern: habit-formation }
  - { type: Produces, pattern: skills }
  - { type: Combines with, pattern: human-in-the-loop }
---
