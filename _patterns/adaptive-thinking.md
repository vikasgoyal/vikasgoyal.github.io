---
title: Adaptive Thinking Budget
n: 36
family: fastslow
maturity: emg
axes: [decision]
intent: One model switches between no thinking and deep thinking based on difficulty.
aka: hybrid reasoning, effort control, variable thinking budget
status: full

problem: >-
  Many current models can answer directly or reason at length first, with the amount of
  thinking set per request. A fixed setting is wrong for most traffic: always-deep wastes
  time and tokens on easy requests, and always-shallow fails the hard ones.
forces:
  - Thinking tokens improve hard answers but add latency and cost.
  - Request difficulty varies widely, even within one product.
  - Two separate models mean two things to evaluate, version and monitor.
  - The model's own sense of difficulty is useful but not fully reliable.

solution: >-
  Use one model that supports a thinking or effort setting, and choose the setting per
  request. A cheap policy picks the level from signals available before the call: task
  type, input length, user tier, stakes and past failure rates for similar requests. Some
  models can also adjust their own effort within a cap. Set a hard upper budget per request,
  and raise the level on retry when a check fails.

diagram: adaptive-thinking
diagram_caption: Same model, different setting. The policy picks the effort level before the call; a failed check can retry one level higher.

use_when:
  - Your model supports adjustable thinking or effort levels
  - Request difficulty varies a lot within the same product
  - You want fast/slow behavior without running two models
  - You can measure quality per effort level to tune the policy
avoid_when:
  - Your model has no effort control
  - All requests are similar; just pick one fixed level
  - You need a different model's strengths, not just more thinking

tradeoffs:
  latency:     { score: 2, note: "Low effort is fast; high effort only where chosen" }
  cost:        { score: 2, note: "Thinking tokens spent mainly on hard requests" }
  complexity:  { score: 2, note: "One model plus a small policy" }
  reliability: { score: 3, note: "Depends on the policy picking levels well" }
gains:
  - Fast/slow behavior with one model to evaluate and version
  - Spending tracks difficulty instead of averaging it
  - Simple to retry at a higher level when a check fails
costs:
  - Policy errors put hard requests on low effort
  - Thinking budgets and pricing differ across model versions
  - Harder to compare quality when effort varies per request

example:
  scenario: An internal coding assistant serves about 3,000 requests a day across an engineering org.
  steps:
    - who: Policy
      what: "Reads signals before each call: task type, files touched and whether tests exist."
    - who: Low effort
      what: "“Rename this variable across the file.” Answers in 2 seconds with no thinking."
    - who: Medium effort
      what: "“Add input validation to this endpoint.” Spends a few thousand thinking tokens and answers in 9 seconds."
    - who: High effort
      what: "“Why does this race condition only appear under load?” Gets the maximum budget and answers in 70 seconds with a reproduction plan."
    - who: Retry
      what: "A medium-effort change fails the test suite. The policy retries once at high effort, and the tests pass."
    - who: Weekly review
      what: "About 70% of requests run at low effort. Rerun failures cluster in database migrations, so the policy now starts those at high."

failures:
  - failure: Hard request at low effort
    symptom: Quick, confident, wrong answers on tricky tasks
    fix: Retry one level higher when a check fails; learn from reruns
  - failure: Effort creep
    symptom: Policy drifts toward high effort for everything
    fix: Track the effort mix as a cost metric with a target
  - failure: Overthinking simple tasks
    symptom: Long reasoning that changes nothing on trivial requests
    fix: Cap budgets per task type; compare outputs at two levels
  - failure: Version drift
    symptom: A model update changes what each level costs or does
    fix: Re-baseline the policy on every model version change

related:
  - { type: Alternative, pattern: fast-slow-escalation }
  - { type: Combines with, pattern: budget-aware-planning }
  - { type: Combines with, pattern: metacognitive-monitor }
  - { type: Combines with, pattern: routing }
  - { type: Combines with, pattern: reflection }
---
