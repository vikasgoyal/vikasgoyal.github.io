---
title: Habit Formation
n: 38
family: fastslow
maturity: hor
axes: [context]
intent: Repeated System 2 solutions get compiled into fast System 1 skills or rules.
aka: System 2 → System 1 distillation, skill caching, learned shortcuts
status: full

problem: >-
  An agent that escalates to slow reasoning keeps solving the same hard cases from scratch.
  The tenth time it handles a cancelled flight or a duplicate invoice, it spends the same
  time and tokens as the first. People get faster at familiar problems; agents usually
  don't.
forces:
  - Many "hard" cases repeat with small variations.
  - Reusing a past solution is far cheaper than reasoning again.
  - A shortcut learned from bad examples spreads mistakes quickly.
  - Cached knowledge goes stale as policies and systems change.

solution: >-
  Log every System 2 solution with its inputs, reasoning and outcome. Periodically group
  similar solved cases and look for ones that succeeded consistently. Turn each stable
  cluster into something System 1 can use directly: a skill with step-by-step
  instructions, a rule, a few-shot example, a cached answer or, at larger scale, fine-tuning
  data. Gate every new habit on an evaluation set, give it an owner and an expiry date, and
  re-check it whenever the underlying policy or system changes.

diagram: habit-formation
diagram_caption: The slow path writes the cases; an offline step promotes repeated, successful ones into fast skills. Escalation rates should fall over time.

use_when:
  - The same kinds of hard case keep reaching System 2
  - Outcomes can be judged, so you know which solutions worked
  - You already log traces from the slow path
  - Cost or latency of escalations is a real concern
avoid_when:
  - Hard cases are genuinely unique each time
  - You can't tell good solutions from bad ones
  - Policies change so fast that habits expire before they pay off

tradeoffs:
  latency:     { score: 1, note: "Repeated cases move to the fast path" }
  cost:        { score: 1, note: "Fewer escalations over time" }
  complexity:  { score: 4, note: "Logging, clustering, evals and expiry" }
  reliability: { score: 3, note: "Good when gated; risky if bad habits slip in" }
gains:
  - The agent gets faster and cheaper at familiar problems over time
  - Reasoning effort shifts to genuinely new cases
  - Promoted skills are readable and reviewable by people
costs:
  - Needs a pipeline: trace logging, grouping, evaluation and rollout
  - A bad habit applies confidently to every matching case
  - Stale habits need active expiry and re-checks

example:
  scenario: A travel-desk agent uses Fast/Slow Escalation. Same-day rebookings after cancellations always escalate to System 2.
  steps:
    - who: Month 1
      what: "214 cancellation rebookings escalate. Each takes about 18 seconds of reasoning."
    - who: Clustering
      what: "Groups solved cases and finds that 160 of them followed the same steps: same-day, same airline, in-policy fare, preferred seat. The outcome was accepted 96% of the time."
    - who: Promotion
      what: "That cluster becomes a skill, `rebook_same_day_in_policy`, with step-by-step instructions System 1 can follow."
    - who: Eval gate
      what: "On 40 held-out cases, the skill matches System 2's choice 38 times. The 2 misses involved partner airlines, so they're excluded from the skill."
    - who: Month 2
      what: "Escalations for cancellations drop from 214 to 61. The skill has an owner and a 90-day expiry, and gets re-checked when the travel policy changes."

failures:
  - failure: Learning bad habits
    symptom: A shortcut copies a solution that only looked successful
    fix: Promote only cases with verified good outcomes; gate on evals
  - failure: Over-generalization
    symptom: Skill applied to cases that look similar but aren't
    fix: Write explicit preconditions; exclude known edge cases
  - failure: Stale habits
    symptom: Skill follows last quarter's policy
    fix: Owners, expiry dates and re-checks on policy change
  - failure: Invisible changes
    symptom: Nobody knows why behavior shifted
    fix: Version skills and log which one handled each case

related:
  - { type: Builds on, pattern: fast-slow-escalation }
  - { type: Produces, pattern: skills }
  - { type: Specializes, pattern: learning-loop }
  - { type: Combines with, pattern: llm-as-judge }
  - { type: Combines with, pattern: tiered-memory }
---
