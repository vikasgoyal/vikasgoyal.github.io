---
title: Model Council
n: 51
family: multi
maturity: emg
axes: [verification, coordination]
intent: Several models answer independently in parallel, and a judge maps where they agree and diverge instead of collapsing them into one answer.
aka: multi-model panel, agreement map, ensemble report
status: full

problem: >-
  For hard judgment questions, a single model's answer hides its uncertainty. Asking several
  models and taking a vote or picking the best answer throws away the most useful signal:
  where capable models disagree is usually exactly where the question is uncertain, and where
  a decision-maker should look closest.
forces:
  - Disagreement between capable models is information, not noise.
  - Decision-makers want one clear answer, but not false confidence.
  - Running several models multiplies cost.
  - Models that see each other's answers drift toward agreement.

solution: >-
  Send the same question and sources to three or more models, ideally from different
  families, and keep them independent: none sees the others' answers. Each writes a full
  report. A judge then compares them and produces an agreement map rather than a merged
  answer. It shows points all models agree on (higher confidence), points where they diverge
  and why, and findings only one model raised (to verify). The final output leads with the
  shared conclusions, then shows the divergences plainly, so the reader decides with the
  uncertainty visible.

diagram: model-council
diagram_caption: Unlike voting, the council doesn't hide the minority view. Its output is the map of agreement and disagreement.

use_when:
  - High-stakes judgment calls where uncertainty matters to the decision
  - Strategy, risk or investment questions without a single checkable answer
  - Readers who will make the final call and want to see the uncertainty
  - You can afford several full reports per question
avoid_when:
  - Questions with a verifiable answer; check it directly
  - Routine questions where one good answer is enough
  - When readers need a single action and will ignore the divergence section

tradeoffs:
  latency:     { score: 3, note: "Models run in parallel; the judge adds one pass" }
  cost:        { score: 5, note: "Several full reports plus a judge per question" }
  complexity:  { score: 3, note: "Independence, a comparison format, presentation" }
  reliability: { score: 4, note: "Uncertainty made visible instead of hidden" }
gains:
  - Shows decision-makers where confidence is high and where it isn't
  - Surfaces unique findings one model alone would have missed
  - Reduces over-reliance on a single model's view
costs:
  - The most expensive verification pattern
  - Long outputs if divergences aren't summarized well
  - Correlated models can agree on the same mistake

example:
  scenario: A strategy team asks whether to consolidate three regional customer-support platforms into one within 18 months.
  steps:
    - who: Council
      what: "Three models from different families each get the same question and an internal data pack. They write independent 2-page reports in parallel."
    - who: Agreement
      what: "All three agree that consolidation cuts licence and maintenance cost, and that the data migration is the biggest risk."
    - who: Divergence
      what: "Two models say 18 months is realistic; one says 24–30 months, citing the APAC platform's custom integrations. The judge marks this as the key uncertainty."
    - who: Unique finding
      what: "Only one model notes that the EU platform's contract has a 12-month termination notice. It's flagged for verification, and legal confirms it."
    - who: Output
      what: "A one-page summary: shared conclusions first, then the timeline disagreement with both arguments, then the contract finding. The team commissions a 2-week integration audit before committing to a date."

failures:
  - failure: Collapsed to a vote
    symptom: Output hides the minority view behind a majority answer
    fix: Judge must report agreement, divergence and unique points separately
  - failure: Lost independence
    symptom: Models see each other's answers and converge
    fix: Run in parallel with no shared context until the judge step
  - failure: Correlated council
    symptom: All models make the same mistake, so agreement looks like confidence
    fix: Use different model families; verify agreed facts that matter most
  - failure: Unreadable output
    symptom: Readers drown in three full reports
    fix: Lead with a one-page map; link full reports for detail

related:
  - { type: Alternative, pattern: debate }
  - { type: Variant of, pattern: parallelization }
  - { type: Alternative, pattern: cross-model-critique }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: deep-research-loop }
---
