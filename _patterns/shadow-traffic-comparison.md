---
title: Shadow-Traffic Comparison
n: 68
family: verify
maturity: est
axes: [verification]
intent: Mirror real requests to old and new code, compare outputs, and cut over only when they match.
aka: traffic mirroring, dark launch, parallel run, differential testing
status: full

problem: >-
  Coding agents can now rewrite or port a whole service in days, producing far more code than
  anyone can review line by line. Tests only check the behaviour someone thought to write down,
  while real traffic exercises edge cases nobody listed. A big-bang cutover risks an outage, and
  reading every line is not possible at that size.
forces:
  - Agent-written code is too large to review in full.
  - Test suites encode only known behaviour.
  - Real traffic has edge cases nobody listed.
  - Side effects such as writes and emails can't safely run twice.

solution: >-
  Put a thin routing layer in front of the service. Every request goes to the current system,
  whose response is returned to the user, and is mirrored to the new system, whose response is
  only recorded. A comparator normalizes fields that may legitimately differ, such as
  timestamps, ids and ordering, and logs every mismatch with its input. Each class of mismatch
  becomes a failing test and a task for the coding agent, which fixes it and redeploys. The loop
  repeats until the mismatch rate stays below an agreed threshold over enough traffic. Writes
  go to a copy or are stubbed. Traffic then shifts to the new system in steps, with the old one
  kept as a fallback.

diagram: shadow-traffic-comparison
diagram_caption: Users only ever see the old system's answer. The new system earns the switch by matching it on real traffic.

use_when:
  - Replacing a live service or major component (rewrite, port, upgrade)
  - Agent-written changes too large to review line by line
  - Behaviour is visible as requests and responses
  - Side effects can be stubbed or pointed at a copy
avoid_when:
  - New features with no existing behaviour to compare against
  - Systems dominated by side effects that can't be isolated
  - Very low traffic; replay recorded traffic instead

tradeoffs:
  latency:     { score: 1, note: "Mirroring is asynchronous; users wait only for the old path" }
  cost:        { score: 4, note: "Double compute for the length of the trial" }
  complexity:  { score: 4, note: "Router, comparator and normalization rules" }
  reliability: { score: 5, note: "Cutover backed by matching behaviour on real traffic" }
gains:
  - Large agent-written changes verified without reading every line
  - Real edge cases found before users hit them
  - A clear, measurable bar for cutting over
costs:
  - Extra infrastructure that is thrown away afterwards
  - Normalization rules need care, or they hide real differences
  - Rare paths may need recorded traffic to be exercised

example:
  scenario: The Linkwatch team uses coding agents to port its redirect API from Python to Rust.
  steps:
    - who: Router
      what: "A thin Python layer mirrors 100% of read traffic to the Rust service. Responses are compared after normalizing timestamps and header order."
    - who: Day 1
      what: "3.1% of responses differ. The biggest cause is how the two versions encode Unicode characters in URLs."
    - who: Agent loop
      what: "Each mismatch class becomes a failing test. The agent fixes it and the Rust service is redeployed daily."
    - who: Day 12
      what: "0.02% mismatch over 40 million requests. The remaining cases are reviewed, judged harmless and recorded."
    - who: Cutover
      what: "Traffic shifts 1% → 10% → 100% over a week. The Python service stays on standby as a fallback for two more weeks."

failures:
  - failure: Noisy diffs
    symptom: Thousands of mismatches from timestamps or ids
    fix: Normalize fields that legitimately differ before comparing
  - failure: Over-normalization
    symptom: Real differences hidden by comparator rules
    fix: Review normalization rules and keep a raw sample
  - failure: Side effects run twice
    symptom: Duplicate writes or emails from the shadow
    fix: Point shadow writes at a copy or stub them
  - failure: Rare paths never exercised
    symptom: Cutover breaks a low-traffic endpoint
    fix: Replay recorded traffic for rare endpoints before cutover

related:
  - { type: Analog of, pattern: shadow-mode-autonomy }
  - { type: Combines with, pattern: test-first-loop }
  - { type: Combines with, pattern: invariant-anchored-goals }
  - { type: Analog of, pattern: chaos-hardening-loop }
  - { type: Feeds, pattern: production-feedback-loop }
---
