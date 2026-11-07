---
title: Draft–Verify
n: 34
family: fastslow
maturity: emg
axes: [verification]
intent: System 1 drafts quickly; System 2 checks or corrects the draft.
aka: draft-then-check, generate–verify, cheap writer + strong checker
status: full

problem: >-
  Having a reasoning model write every output from scratch is slow and expensive, but
  shipping a fast model's drafts unchecked lets its confident mistakes through. Most drafts
  are fine; the cost is in finding the few that aren't.
forces:
  - Checking a draft is usually faster and cheaper than writing it.
  - Fast models get most outputs right but fail unpredictably on some.
  - A verifier that rewrites everything erases the savings.
  - Some errors are only visible against source data the drafter didn't use well.

solution: >-
  Let a fast model produce every draft. Pass the draft, the original request and the source
  material to a reasoning model with a narrow job: verify specific claims and return a
  verdict per claim (supported, wrong or missing) plus minimal corrections. Accept the
  draft as-is when everything checks out, apply the small corrections when they don't, and
  regenerate with the strong model only when the draft is beyond repair.

diagram: draft-verify
diagram_caption: The verifier returns a verdict and edits, not a new answer. Most traffic takes the top path with no changes.

use_when:
  - High-volume outputs that are mostly correct already
  - Claims can be checked against provided sources or data
  - Verifying is clearly cheaper than generating, such as long drafts with a few facts
  - Errors are costly but latency can absorb one check
avoid_when:
  - The fast model is wrong so often that most drafts get regenerated
  - There is no source of truth to check against
  - Real-time replies where even one check is too slow; see Respond-then-Refine

tradeoffs:
  latency:     { score: 3, note: "Draft plus one verification pass" }
  cost:        { score: 2, note: "Strong model reads and checks; it rarely writes" }
  complexity:  { score: 2, note: "Two prompts and a verdict format" }
  reliability: { score: 4, note: "Catches factual errors a self-check misses" }
gains:
  - Strong-model accuracy at close to fast-model cost
  - Per-claim verdicts show exactly what was wrong
  - Correction rates tell you when the fast model has drifted
costs:
  - The verifier can only check what's checkable
  - Two models to version and evaluate together
  - Subtle errors of omission are hard to verify

example:
  scenario: A finance-ops agent writes monthly variance commentary for 40 cost centers from the ledger data.
  steps:
    - who: Fast model
      what: Drafts 40 short commentaries in about 12 seconds total.
    - who: Verifier
      what: "Checks each number and claim against the ledger. 34 drafts pass with no changes."
    - who: Verifier
      what: "5 drafts get small fixes. One example: “travel up 12%” is corrected to 21%, the actual change from $48k to $58k."
    - who: Verifier
      what: "1 draft blames a variance on headcount, but the ledger shows a one-time vendor credit. `verdict: regenerate`. The strong model rewrites that one."
    - who: Weekly metrics
      what: Correction rate is 15%. A month later it rises to 30% after a prompt change, which flags a regression before anyone reads a wrong report.

failures:
  - failure: Verifier rewrites everything
    symptom: Output looks like the strong model wrote it; no savings
    fix: Ask for verdicts and minimal edits only; measure edit size
  - failure: Unverifiable claims slip through
    symptom: Opinions or causes pass because there's no data to contradict them
    fix: Flag claims with no supporting source as "unsupported"
  - failure: Verifier trusts the draft's framing
    symptom: Checks numbers but misses a wrong conclusion
    fix: Include "does the conclusion follow from the data?" as a check item
  - failure: Shared source errors
    symptom: Both models agree on wrong source data
    fix: Validate source data upstream; verification can't fix bad inputs

related:
  - { type: Stronger than, pattern: reflection }
  - { type: Alternative, pattern: fast-slow-escalation }
  - { type: Generalizes, pattern: evaluator-optimizer }
  - { type: Combines with, pattern: llm-as-judge }
  - { type: Real-time variant, pattern: respond-then-refine }
---
