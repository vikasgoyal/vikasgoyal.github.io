---
title: Agent-Legible Systems
n: 65
family: observe
maturity: emg
axes: [context, verification]
intent: Build the running system so that its signals can be traced to a specific cause, letting an agent diagnose and confirm fixes on its own.
aka: attributable telemetry, observability for agents, measurable stack
status: full

problem: >-
  An agent can only close a loop on what it can measure. Most systems emit coarse signals,
  such as total memory, average latency and error counts, that say something is wrong but not
  where. Telemetry is usually added by hand after an outage. Hidden behavior inside
  dependencies and runtime effects such as garbage collection add noise that blurs cause and
  effect. Given these signals, an agent guesses, ships a plausible fix, and can't tell whether it
  helped.
forces:
  - Fine-grained telemetry has a cost in storage and effort.
  - Libraries hold state and memory the team didn't write and can't see.
  - Runtime noise can swamp the effect of a single change.
  - Changing the stack or dependencies is expensive later.

solution: >-
  Design for attribution. Each operation reports what it did in terms that point at causes: for
  example, every database query reports its name plus rows scanned versus rows returned, and each
  cache reports what it holds and why. Give agents access to this telemetry, often through an
  observability connector. When an agent hits a question the signals can't answer, it adds the
  missing telemetry as part of the fix. Prefer components whose behavior is easy to measure:
  few dependencies, vendored code for the few you need so it can be instrumented, and runtimes
  where memory and latency changes can be traced to a specific cause. Use the rerun after each
  fix to confirm or drop it.

diagram: agent-legible-systems
diagram_caption: Coarse signals only say something is wrong. Attributed signals tell the agent where, so each fix can be confirmed or dropped.

use_when:
  - Agents diagnose or tune running systems
  - Performance or memory problems are hard to pin down
  - You plan an agent hardening or feedback loop
  - New services where stack and dependencies are still open
avoid_when:
  - Simple systems where coarse metrics already explain failures
  - Mature systems where rewriting the stack costs more than it saves; add attribution where it's cheap instead
  - When telemetry would capture personal data without controls

tradeoffs:
  latency:     { score: 1, note: "Small overhead per operation" }
  cost:        { score: 2, note: "More telemetry to store and query" }
  complexity:  { score: 3, note: "Instrumentation design and stack choices" }
  reliability: { score: 4, note: "Fixes confirmed by evidence, not guesses" }
gains:
  - Agents find causes, not just symptoms
  - Wrong fixes are spotted and dropped quickly
  - Telemetry grows where gaps were found, not after outages
costs:
  - Telemetry volume and storage
  - Stack choices may limit hiring or libraries
  - Vendored code needs upkeep

example:
  scenario: Linkwatch's link-preview service uses about 2 GB of memory per busy page, and nobody knows why.
  steps:
    - who: First guess
      what: "The agent shrinks the team's page cache. The rerun shows no change: the memory was in a cache inside an image library."
    - who: Add telemetry
      what: "The agent vendors the library and adds memory reporting for its internal structures and for each request type."
    - who: Cause found
      what: "Every preview request copies the page's full link list into 3 structures. The agent changes them to share one copy."
    - who: Confirmed
      what: "The rerun shows peak memory falling to about 200 MB. The new telemetry stays, so the next regression is visible at once."

failures:
  - failure: Coarse signals
    symptom: Agent ships fix after fix with no measurable effect
    fix: Report per-operation numbers that point at causes
  - failure: Black-box dependencies
    symptom: Memory or latency hides inside a library
    fix: Minimize dependencies; vendor and instrument the ones you keep
  - failure: Noise swamps signal
    symptom: Runs vary more than the effect of any fix
    fix: Control runtime noise; repeat runs; compare like for like
  - failure: Telemetry leaks data
    symptom: Logs capture user content
    fix: Record shapes and counts, not payloads; apply data controls

related:
  - { type: Enables, pattern: chaos-hardening-loop }
  - { type: Enables, pattern: production-feedback-loop }
  - { type: Analog of, pattern: agent-ready-repo }
  - { type: Combines with, pattern: delivery-dividend-metrics }
  - { type: Analog of, pattern: metacognitive-monitor }
---
