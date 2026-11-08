---
title: Rubric LLM-as-Judge
n: 30
family: eval
maturity: emg
axes: [verification]
intent: Automated graders with explicit rubrics for CI evals and runtime monitoring.
aka: model-graded evals, rubric grading, AI judge
status: full

problem: >-
  Agent outputs are open-ended, so exact-match tests can't grade them, and human review
  doesn't scale to thousands of outputs or every prompt change. Teams end up shipping
  changes based on a handful of spot checks, and quality drifts without anyone noticing.
forces:
  - Open-ended outputs need judgment to grade, not string matching.
  - Human graders are accurate but slow and expensive.
  - Model judges are fast but can be biased, inconsistent or easy to game.
  - A grade is only useful if people trust it enough to act on it.

solution: >-
  Write an explicit rubric: a short list of criteria, each with a scale or pass/fail, a
  definition and examples of each level. A judge model scores outputs against the rubric
  one criterion at a time and gives a reason for each score. Calibrate the judge against a
  set of human-graded examples and track agreement before trusting it. Use it in two
  places: in CI, to score a fixed test set on every prompt or model change, and in
  production, to score a sample of live traffic and alert on drops. Send low-confidence
  or borderline scores to people.

diagram: llm-as-judge
diagram_caption: The judge is only as good as its calibration. Human-labeled examples anchor it, and borderline scores go back to people.

use_when:
  - Outputs are open-ended text, plans or actions
  - You change prompts, models or tools often and need regression checks
  - Quality criteria can be written down and illustrated with examples
  - You want ongoing monitoring of live quality
avoid_when:
  - Outputs can be checked exactly (math, schemas, tests); check them directly
  - You have no human-labeled examples to calibrate against
  - The criteria are so subjective that humans disagree with each other

tradeoffs:
  latency:     { score: 2, note: "Offline in CI; sampled asynchronously in production" }
  cost:        { score: 2, note: "Much cheaper than human review at scale" }
  complexity:  { score: 3, note: "Rubric, calibration set, dashboards" }
  reliability: { score: 3, note: "Good once calibrated; drifts if not re-checked" }
gains:
  - Every change is graded before it ships
  - Live quality is visible, with alerts on drops
  - Per-criterion scores show exactly what got worse
costs:
  - Judges have biases (length, position, their own style)
  - Calibration sets need upkeep as the product changes
  - Teams may over-trust a number that's only partly reliable

example:
  scenario: A support assistant team grades replies on 4 criteria, accuracy against docs, resolves the issue, tone and policy compliance, each scored 1–5 with defined levels.
  steps:
    - who: Calibration
      what: "Support leads label 200 replies. The judge's scores match a human's within 1 point on 91% of criterion scores. Tone agreement is lowest at 84%, so the tone definition gets two more examples."
    - who: CI
      what: "A prompt change runs against 300 test conversations. Accuracy is flat, but “resolves the issue” drops from 4.2 to 3.6. The change is blocked, with 12 example failures attached."
    - who: Production
      what: "The judge scores a 5% sample of live replies daily. When a new feature launches, accuracy dips for questions about that feature, and the docs team is alerted the same day."
    - who: Borderline queue
      what: "Scores of 2–3 on policy compliance, about 20 a day, go to a human reviewer instead of being trusted automatically."
    - who: Quarterly
      what: "The calibration set is refreshed with 50 new examples from recent traffic, and judge agreement is re-measured."

failures:
  - failure: Uncalibrated judge
    symptom: Scores look precise but don't match human judgment
    fix: Measure agreement on human-labeled examples before relying on it
  - failure: Length or style bias
    symptom: Longer or more confident answers score higher regardless of quality
    fix: Rubric definitions that penalize padding; test for bias explicitly
  - failure: Gaming the judge
    symptom: Optimized prompts score higher but users aren't happier
    fix: Hold out human reviews; rotate examples; track real outcomes too
  - failure: Single overall score
    symptom: Regressions hidden in an average
    fix: Score and alert per criterion

related:
  - { type: Generalizes, pattern: evaluator-optimizer }
  - { type: Feeds, pattern: learning-loop }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: draft-verify }
  - { type: Combines with, pattern: habit-formation }
---
