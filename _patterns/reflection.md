---
title: Reflection
n: 4
family: core
maturity: est
axes: [verification]
intent: The agent critiques and revises its own output before returning it.
aka: self-critique, self-refine, self-review
status: full

problem: >-
  First drafts from a model often have fixable problems: a missed requirement, a wrong
  number, a format slip, an unsupported claim. The model could catch many of these if asked
  to look, but in a single pass it never does.
forces:
  - Reviewing is easier than writing, so a second look catches real errors.
  - The same model shares its own blind spots and tends to approve its work.
  - Every review round adds latency and cost.
  - Vague "make it better" prompts produce cosmetic edits, not fixes.

solution: >-
  After the first draft, run the same model again with a critic prompt and an explicit
  checklist: requirements met, facts supported by the provided sources, format correct.
  The critic lists concrete issues or says none. If there are issues, the model revises the
  draft to address exactly those, and the loop stops after one or two rounds. Where you can,
  replace self-judgment with an external check such as running the code, validating the
  schema or matching numbers to source data.

diagram: reflection
diagram_caption: A checklist keeps the critique specific. External checks, like running tests, are stronger signals than the model's own opinion.

use_when:
  - Errors are cheap to detect once you look (format, missing items, math)
  - You can write a short, specific checklist
  - A bit of extra latency is acceptable for higher quality
  - An external signal is available, such as tests, a schema or source data
avoid_when:
  - Quality needs an independent judge; use Evaluator–Optimizer
  - The task is simple and first drafts are already reliable
  - Real-time responses where every second counts

tradeoffs:
  latency:     { score: 3, note: "Adds 1–2 extra model passes" }
  cost:        { score: 3, note: "Roughly 2–3× a single pass" }
  complexity:  { score: 1, note: "One extra prompt and a round limit" }
  reliability: { score: 3, note: "Catches surface errors; misses shared blind spots" }
gains:
  - Cheap quality lift with no extra models or infrastructure
  - Catches missed requirements and format errors reliably
  - The critique doubles as an explanation of what was checked
costs:
  - Self-approval bias, since the model often likes its own work
  - Can over-edit good drafts into worse ones
  - Weak on factual errors the model believes are true

example:
  scenario: An agent drafts a customer email summarizing a production incident, using the incident ticket as its source.
  steps:
    - who: Draft
      what: Writes a 180-word email covering impact, root cause and next steps.
    - who: Critique
      what: "Checklist results: duration in the email says 2 hours but the ticket says 47 minutes. No ETA for the fix. Internal hostname `db-prod-07` is exposed. `verdict: revise (3 issues)`"
    - who: Revise
      what: Corrects the duration to 47 minutes, adds a fix date of Nov 12, and replaces the hostname with "a primary database".
    - who: Critique
      what: "All checklist items pass. `verdict: done (round 2)`"
    - who: Log
      what: Over a month, the "internal details exposed" check fires most often. That becomes a permanent rule in the drafting prompt.

failures:
  - failure: Rubber-stamping
    symptom: Critic says "looks good" almost every time
    fix: Ask for specific issues per checklist item; add external checks
  - failure: Over-editing
    symptom: Revisions change correct content or tone
    fix: Revise only flagged issues; keep the rest verbatim
  - failure: Shared blind spot
    symptom: Same wrong fact survives every round
    fix: Check facts against sources, or use a different model as judge
  - failure: Endless polishing
    symptom: Rounds continue with tiny changes
    fix: Cap at 2 rounds; stop when no checklist item fails

related:
  - { type: Stronger version, pattern: evaluator-optimizer }
  - { type: Combines with, pattern: react }
  - { type: Alternative, pattern: draft-verify }
  - { type: Combines with, pattern: llm-as-judge }
  - { type: Combines with, pattern: guardrails }
---
