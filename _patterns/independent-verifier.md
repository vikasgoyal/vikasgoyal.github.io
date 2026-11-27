---
title: Independent Verifier
n: 70
family: verify
maturity: emg
axes: [verification, context]
intent: Check agent work in a fresh session that never saw how the code was written, so no agent grades itself.
aka: out-of-process verification, fresh-context review, separate verifier
status: full

problem: >-
  The agent that writes a change usually also tests and judges it. It carries its own
  assumptions into the tests, writes tests that confirm what it built, and reads its own diff
  charitably. Checks in the same session catch typos and obvious slips, but not a wrong
  assumption, because the checker shares it.
forces:
  - The author's context biases its own checks.
  - A fresh context also lacks useful background.
  - A second session costs tokens and time.
  - Author and verifier can share blind spots if they share a model and prompt.

solution: >-
  When the coding agent finishes, start a separate verifier session with a clean context. Give
  it only the spec or acceptance criteria, the diff, and the ability to run the code and tests,
  not the author's conversation or reasoning. Its job is to write or extend tests from the
  spec, try to break the change, and report findings with evidence. The author agent fixes what
  it finds, and the verifier checks again. For risky changes, use a different model family or a
  different prompt for the verifier. Attach the verifier's report to the pull request so human
  reviewers start from evidence rather than from the raw diff.

diagram: independent-verifier
diagram_caption: The verifier sees only the spec and the diff. It can't inherit the author's assumptions, so it catches the ones that are wrong.

use_when:
  - Agent changes merge with little human reading
  - Logic where a wrong assumption is costly
  - AI first-pass review is in place and you want stronger evidence
  - Long agent sessions where context may have drifted
avoid_when:
  - Tiny mechanical changes already covered by existing tests
  - No spec or acceptance criteria to check against
  - Low-risk repos with a tight token budget

tradeoffs:
  latency:     { score: 2, note: "A second session after the author finishes" }
  cost:        { score: 3, note: "Roughly doubles agent tokens for checked changes" }
  complexity:  { score: 2, note: "Session setup and a report format" }
  reliability: { score: 4, note: "Catches wrong assumptions the author can't see" }
gains:
  - Agent work is never graded only by its author
  - Reviewers get evidence, not just a diff
  - Tests are written from the spec, not from the code
costs:
  - Extra tokens and wait time for every checked change
  - The verifier misses context the author legitimately had
  - Back-and-forth between agents can stall without a cap

example:
  scenario: The Linkwatch team adds a per-user limit of 60 link checks per minute.
  steps:
    - who: Author agent
      what: "Implements the limit with a fixed one-minute window and 4 tests. All tests pass."
    - who: Verifier
      what: "A fresh session gets the spec and the diff only. It writes 6 tests from the spec, including bursts that span a minute boundary."
    - who: Finding
      what: "119 checks get through in 2 seconds across a minute boundary. The author's tests never crossed a boundary."
    - who: Fix
      what: "The author agent switches to a sliding window. The verifier reruns its 6 tests and all pass."
    - who: Pull request
      what: "The verifier's report is attached. The reviewer reads the report and the window logic instead of the whole diff, and approves in 10 minutes."

failures:
  - failure: Shared context
    symptom: Verifier repeats the author's assumptions
    fix: Pass only the spec and the diff, never the author's session
  - failure: Rubber stamp
    symptom: Verifier says "looks good" with no evidence
    fix: Require tests run and outputs shown in every report
  - failure: Shared blind spots
    symptom: Same model misses the same class of bug
    fix: Use a different model or prompt for high-risk changes
  - failure: Endless back-and-forth
    symptom: Author and verifier loop without converging
    fix: Cap the rounds, then escalate to a person

related:
  - { type: Specializes, pattern: context-isolation }
  - { type: Combines with, pattern: test-first-loop }
  - { type: Combines with, pattern: ai-first-pass-review }
  - { type: Analog of, pattern: cross-model-critique }
  - { type: Analog of, pattern: evaluator-optimizer }
---
