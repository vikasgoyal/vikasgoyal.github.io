---
title: Fast/Slow Escalation
n: 33
family: fastslow
maturity: emg
axes: [decision, verification]
intent: System 1 by default; escalate to System 2 when signals say the task is hard.
aka: System 1 / System 2 agent, dual-process agent, model escalation
status: full

problem: >-
  Reasoning models are accurate but slow and expensive. Fast models are cheap and
  responsive but make confident mistakes on hard or unusual requests. Sending everything
  to the reasoning model wastes money and latency; sending everything to the fast model
  ships errors.
forces:
  - Latency and cost push toward the fast model on every turn.
  - Accuracy on hard or high-stakes cases pushes toward the reasoning model.
  - Fast models are poor judges of their own confidence, so the switch cannot rely on self-report alone.
  - Most real traffic is routine, so the savings from defaulting fast are large.

solution: >-
  Run every request through a System 1 model first. An escalation gate checks a small set
  of signals: model confidence, novelty (distance from known cases), business stakes, and
  the result of a cheap rule or schema check. If any signal trips, the same request, plus
  System 1's draft, goes to the System 2 model. Log every gate decision so the thresholds
  can be tuned against real outcomes.

diagram: fast-slow-escalation
diagram_caption: "The gate sits between the models. Dashed path: escalation, typically 10–25% of traffic."

use_when:
  - Traffic is mostly routine with a long tail of hard cases
  - Latency matters, such as chat, voice or customer-facing flows
  - You can define stakes in business terms, such as refund amount or account tier
  - You have logs to calibrate thresholds
avoid_when:
  - Every request is hard, so escalation would fire constantly
  - A single wrong answer is unacceptable; use System 2 plus human review
  - You have no way to measure whether escalations were correct

tradeoffs:
  latency:     { score: 2, note: "Fast path ~0.5s; escalated path adds seconds" }
  cost:        { score: 2, note: "Pays for System 2 only on the tail" }
  complexity:  { score: 3, note: "Two models plus a tuned gate" }
  reliability: { score: 4, note: "Good when signals are calibrated" }
gains:
  - Large cost and latency savings on routine traffic
  - Reasoning budget concentrated where it changes outcomes
  - Gate logs give a clear view of what users find hard
costs:
  - Threshold tuning is ongoing work
  - Two models to version, evaluate and monitor
  - Misses happen when System 1 is confidently wrong and no external signal fires

example:
  scenario: A retail support agent handles order questions. Refunds over $200 need policy reasoning.
  steps:
    - who: User
      what: "“Where's my order #4412?”"
    - who: System 1
      what: "Answers from the order lookup tool. Confidence 0.94, known intent, low stakes. `gate: pass`. Reply in 0.6s."
    - who: User
      what: "“It arrived broken. I want a $340 refund plus shipping on the replacement.”"
    - who: System 1
      what: "Drafts an approval. Confidence 0.81, but the stakes rule trips (refund > $200). `gate: escalate (stakes)`"
    - who: System 2
      what: Reads the policy, notices the item was a final-sale clearance product, and drafts a replacement-only offer with an apology credit.
    - who: Gate log
      what: Records the escalation reason and both drafts. Weekly review shows a 14% escalation rate, and that stakes caught 3× more errors than confidence did.

failures:
  - failure: System 1 confidently wrong
    symptom: Confidence high, answer wrong, no other signal fires
    fix: Add rule checks and novelty signals; never gate on confidence alone
  - failure: Escalation creep
    symptom: Thresholds tightened after each incident until most traffic escalates
    fix: Track escalation rate as a budget metric with an owner
  - failure: Context loss on handoff
    symptom: System 2 gets the question but not the tool results
    fix: Pass the full trace plus System 1's draft
  - failure: Silent drift
    symptom: A model update changes confidence calibration
    fix: Re-calibrate thresholds on every model version change

related:
  - { type: Combines with, pattern: metacognitive-monitor }
  - { type: Alternative, pattern: adaptive-thinking }
  - { type: Specializes, pattern: routing }
  - { type: Combines with, pattern: reflex-layer }
  - { type: Next step, pattern: habit-formation }
---
