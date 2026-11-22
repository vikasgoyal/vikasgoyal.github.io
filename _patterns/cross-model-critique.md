---
title: Cross-Model Critique
n: 50
family: multi
maturity: emg
axes: [verification]
intent: A model from one family drafts, a model from another family critiques, and the draft gets one refinement pass.
aka: cross-vendor review, heterogeneous critic, second-model review
status: full

problem: >-
  When a model checks its own work, or a model from the same family does, they tend to share
  blind spots: the same training gaps, the same confident errors, the same style preferences.
  The review passes work that a reader with a different background would challenge. Adding
  more rounds with the same model mostly polishes the same mistakes.
forces:
  - Different model families make different mistakes, so a second family catches more.
  - A second model adds latency, cost and another vendor to manage.
  - Critics from a different family may also disagree on style, creating noise.
  - Multiple refinement rounds slow things down for shrinking gains.

solution: >-
  Use two models from different families or vendors on purpose. The generator drafts the
  output. The critic, from another family, gets the task, the sources and the draft, and
  returns specific, numbered issues: factual errors, unsupported claims, gaps, logic
  problems, each with a severity and a suggested fix. It critiques but doesn't rewrite. The
  generator makes one refinement pass that addresses every high-severity issue and explains
  any it rejects. Unresolved high-severity issues go to a person. Keep it to one pass; if
  quality still isn't there, the problem is the task or the sources, not the number of rounds.

diagram: cross-model-critique
diagram_caption: The value comes from the critic being different. Its errors are less correlated with the generator's, so it catches what self-review misses.

use_when:
  - High-stakes outputs like recommendations, analyses or customer-facing reports
  - Self-review keeps approving work that people later find wrong
  - You already use more than one model provider
  - One extra pass of latency is acceptable
avoid_when:
  - Routine or low-stakes outputs where one model is good enough
  - Data residency or contracts limit you to one provider
  - Outputs that can be checked exactly with code or tests; check them directly

tradeoffs:
  latency:     { score: 3, note: "One critique plus one refinement pass" }
  cost:        { score: 3, note: "Roughly 2–2.5× a single generation" }
  complexity:  { score: 3, note: "Two vendors, a critique format, issue tracking" }
  reliability: { score: 4, note: "Less correlated errors than self-review" }
gains:
  - Catches errors that self-review and same-family review miss
  - Structured issue lists show what changed and why
  - Reduces dependence on any single model's blind spots
costs:
  - Two vendors to contract, secure and monitor
  - Critics can flag style differences as errors
  - Adds a full pass of latency

example:
  scenario: An agent drafts an architecture recommendation for a customer choosing between two event-streaming designs.
  steps:
    - who: Generator (model family A)
      what: "Drafts a 3-page recommendation favoring design 1, citing throughput, cost and operational effort."
    - who: Critic (model family B)
      what: "Returns 5 numbered issues. High: the cost comparison ignores cross-region egress. High: the throughput figure isn't in the provided benchmark. Medium: no mention of schema evolution. Two low: wording."
    - who: Refinement
      what: "The generator fixes both high issues: it adds egress costs, which narrows the gap, and replaces the throughput number with the benchmark's actual result. It adds a schema evolution section and rejects one wording note with a reason."
    - who: Check
      what: "No high-severity issues remain, so the document goes out. The issue list is attached for the reviewing architect."
    - who: Monthly review
      what: "Across 60 recommendations, the critic's high-severity findings were mostly unsupported numbers. That leads to a new rule in the generator's prompt: cite a source for every figure."

failures:
  - failure: Rewrite instead of critique
    symptom: Critic produces its own version; the generator's reasoning is lost
    fix: Critic returns numbered issues with severity, not a rewrite
  - failure: Style noise
    symptom: Most issues are preferences, burying real errors
    fix: Severity levels; only high issues must be fixed
  - failure: Same-family critic
    symptom: Critic agrees with nearly everything
    fix: Use a different model family; check agreement rates
  - failure: Endless back-and-forth
    symptom: Multiple rounds with shrinking changes
    fix: One refinement pass; escalate what's left to a person

related:
  - { type: Variant of, pattern: evaluator-optimizer }
  - { type: Stronger than, pattern: reflection }
  - { type: Alternative, pattern: model-council }
  - { type: Combines with, pattern: draft-verify }
  - { type: Combines with, pattern: deep-research-loop }
---
