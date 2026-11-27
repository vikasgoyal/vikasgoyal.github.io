---
title: Shadow-Mode Autonomy
n: 67
family: safety
maturity: emg
axes: [decision, verification]
intent: Run an agent beside the current process, compare results, and let it act alone only once it matches reliably.
aka: earned autonomy, shadow mode, parallel run, champion–challenger
status: full

problem: >-
  Teams want agents to take over real work: triaging alerts, fixing defects, routing tickets,
  approving low-risk changes. Demos and benchmarks don't say how the agent will do on *your*
  inputs. Switching it on fully is a leap of faith, while keeping a person approving every
  action forever throws away most of the value. Trust ends up argued about instead of measured.
forces:
  - Real inputs differ from test sets and demos.
  - Some mistakes are costly or can't be undone.
  - Reviewing every agent action doesn't scale.
  - Models and prompts change, so trust earned once can expire.

solution: >-
  Run the agent in shadow. It receives the same inputs as the current process (a person or an
  existing system) and produces its decision or output, but nothing it does takes effect. Log
  both results and compare them with an agreed match rule, separately for each class of input.
  Review disagreements every week: some are agent errors, others show the humans were
  inconsistent. When the match rate stays above an agreed threshold for an agreed period,
  promote the agent one step, for example from shadow to acting with approval, or from approval
  to acting alone on the low-risk class only. Keep sampling after promotion, and demote
  automatically when the match rate drops or the model changes.

diagram: shadow-mode-autonomy
diagram_caption: The agent sees every real input but changes nothing until its record earns promotion, and it drops back to shadow when things change.

use_when:
  - An agent will take over a repeatable task or decision
  - The current process produces an outcome you can compare against
  - Mistakes are costly enough that trust must be earned
  - You can afford to run both paths for a few weeks
avoid_when:
  - One-off or creative work with no comparable output
  - When people disagree too often to act as a reference; fix the rubric first
  - Trivial, easily reversed tasks; let the agent act with rollback instead

tradeoffs:
  latency:     { score: 1, note: "Shadow runs off the critical path" }
  cost:        { score: 3, note: "Both paths run during the trial" }
  complexity:  { score: 3, note: "Logging, a match rule and promotion rules" }
  reliability: { score: 5, note: "Autonomy rises only on evidence" }
gains:
  - Trust based on measured agreement on real inputs
  - Autonomy granted per class of input, not all at once
  - Human mistakes surface too, improving the process itself
costs:
  - Weeks of running two paths before any time is saved
  - Someone has to review disagreements
  - A match rule can be hard to define for open-ended output

example:
  scenario: The Linkwatch team wants an agent to handle on-call pages for the redirect API.
  steps:
    - who: Setup
      what: "The agent receives every page, labels it noise or real, and proposes a runbook action. It has read-only credentials, so nothing it suggests can run."
    - who: Weeks 1–3
      what: "212 pages. The agent's label matches the on-call engineer's on 196 (92%). The team set 90% over three weeks as the bar for the noise class."
    - who: Review
      what: "Of the 16 disagreements, 9 were pages engineers had dismissed as noise that later turned out real. The runbook is updated for those alert types."
    - who: Promote
      what: "Pages the agent labels noise are now acknowledged automatically. Real pages still go to a person, with the agent's proposed action attached."
    - who: Model upgrade
      what: "Auto-acknowledge switches off and the agent returns to shadow for a week. Its match rate holds at 93%, so it is promoted again."

failures:
  - failure: Easy cases hide hard ones
    symptom: High overall match rate, but rare alert types are wrong
    fix: Track the match rate per class and promote class by class
  - failure: Humans treated as always right
    symptom: Agent penalized where the person was wrong
    fix: Review disagreements both ways before scoring
  - failure: Trust never expires
    symptom: Agent keeps acting after a model or prompt change
    fix: Demote to shadow on any model change or drop in match rate
  - failure: Shadow leaks into effect
    symptom: A shadow action actually runs
    fix: Give the shadow agent read-only or no-write credentials

related:
  - { type: Generalizes, pattern: observe-then-enforce-approvals }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Next step, pattern: bounded-autonomy }
  - { type: Analog of, pattern: shadow-traffic-comparison }
  - { type: Combines with, pattern: llm-as-judge }
---
