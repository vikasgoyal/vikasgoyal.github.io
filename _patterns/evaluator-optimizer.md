---
title: Evaluator–Optimizer
n: 9
family: multi
maturity: est
axes: [verification, coordination]
intent: One agent generates, another grades against a rubric, and they loop until it passes.
aka: generator–critic loop, actor–judge, iterative refinement
status: full

problem: >-
  A single generation pass often misses requirements that are easy to check but hard to
  satisfy on the first try: tone, coverage, format, factual grounding. Self-reflection by
  the same model tends to approve its own work.
forces:
  - Quality bars are explicit enough to write as a rubric.
  - Generating is harder than judging, so a separate judge adds real signal.
  - Every loop iteration adds latency and cost.
  - Loops can oscillate or never converge without a stopping rule.

solution: >-
  Split the work into two roles. A generator produces a draft. An evaluator scores it
  against a written rubric and returns structured feedback for each failing criterion.
  The generator revises using that feedback. Stop when all gates pass or after a maximum
  number of iterations, then escalate whatever is still failing.

diagram: evaluator-optimizer
diagram_caption: Feedback is structured per rubric item, not a free-text opinion. The iteration cap prevents endless loops.

use_when:
  - Quality criteria can be written down as a rubric
  - A first draft is usually close but not quite right
  - Outputs go to customers or executives, where polish matters
  - You want an audit trail of why an output passed
avoid_when:
  - There is no clear rubric; the judge will just add noise
  - Latency budgets allow only one pass
  - The judge and generator share the same blind spots (same model, same prompt)

tradeoffs:
  latency:     { score: 4, note: "Each iteration adds a full generate + judge cycle" }
  cost:        { score: 3, note: "Typically 2–3× a single pass" }
  complexity:  { score: 2, note: "Two prompts and a loop" }
  reliability: { score: 4, note: "Strong when the rubric is concrete" }
gains:
  - Measurable quality lift on rubric criteria
  - Per-criterion scores double as eval data
  - Clear point to insert a human for edge cases
costs:
  - Rubric writing and maintenance
  - Judge can be gamed by surface fixes
  - Higher latency and token spend

example:
  scenario: An agent writes customer-call talk scripts for account managers. The rubric checks personalization, pain-point relevance, speakability and invented facts.
  steps:
    - who: Generator
      what: Drafts a 6-line opening script for a renewal call with Acme.
    - who: Evaluator
      what: "Scores: personalization 4/5, speakability 5/5, pain-point relevance 2/5. The invented-facts check flags line 3, a claimed product integration not in the account data. `verdict: revise`"
    - who: Generator
      what: Rewrites line 3 from real account notes and leads with the support-backlog pain point.
    - who: Evaluator
      what: "All gates pass. Pain-point relevance is now 4/5. `verdict: pass (iteration 2)`"
    - who: Log
      what: Stores both drafts and scores. Over a month, the most common revision reason becomes the top prompt improvement for the generator.

failures:
  - failure: Rubber-stamp judge
    symptom: Judge approves nearly everything
    fix: Use a different model or prompt for the judge and calibrate on labeled examples
  - failure: Oscillation
    symptom: Fixing one criterion breaks another
    fix: Feed back all failing items at once and keep passing items locked
  - failure: Surface gaming
    symptom: Generator learns phrases the judge likes
    fix: Rotate judge examples; spot-check with humans
  - failure: Unbounded loops
    symptom: No convergence on hard cases
    fix: Cap at 2–3 iterations, then escalate

related:
  - { type: Lighter version, pattern: reflection }
  - { type: Specializes into, pattern: llm-as-judge }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Alternative, pattern: debate }
  - { type: Fast variant, pattern: draft-verify }
---
