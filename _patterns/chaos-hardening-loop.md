---
title: Chaos Hardening Loop
n: 64
family: verify
maturity: emg
axes: [verification, coordination]
intent: A supervised, long-running agent drives heavy load and deliberate failures against a staging copy of the system, reads the telemetry, fixes what breaks and reruns, against invariants written down in advance.
aka: agentic load-and-fix loop, AI chaos engineering, pre-launch hardening loop
status: full

problem: >-
  A service that works for a few thousand internal users says little about launch day. Load
  tests are usually run a few times by hand, read by busy engineers, and followed by fixes
  weeks later. Rare failures, such as thousands of clients reconnecting at once or a database
  stalling mid-spike, are rehearsed once if at all. Teams launch hoping the system holds, and
  learn its limits in production.
forces:
  - Real scale and real failures are hard to reproduce on demand.
  - Each load run produces more telemetry than people can read closely.
  - Many fixes are plausible but wrong, and only the next run shows it.
  - Some changes (schema, storage layout) are hard to undo and shape the future.

solution: >-
  Run a supervised agent loop against a staging environment that mirrors production. Before
  starting, write down the invariants that must hold, such as "documents open almost instantly"
  and "an acknowledged edit always persists". A harness drives one scenario at a time to
  saturation, well beyond expected traffic (around 10× is a common target), and injects
  failures: killed servers, a stalled database, a deploy in the middle of a spike. The agent
  reads the telemetry, proposes a few options with a recommendation, and for easy-to-undo
  changes writes the fix, has a separate reviewer agent check it, ships it to staging behind a
  runtime flag and reruns. Hard-to-undo changes go to a person to decide. A coordinator can
  spread scenarios across sub-agents, though a single agent is often cheaper. Track the loop's
  own spend, and stop exploration that isn't paying off.

diagram: chaos-hardening-loop
diagram_caption: Every round adds load or failure, reads the signals, and ships a reviewed fix to staging. Invariants stay fixed; hard-to-undo changes wait for a person.

use_when:
  - A launch or traffic step-change is coming
  - A staging environment can mirror production at scale
  - Telemetry is available to the agent (for example through an observability connector)
  - The team can write down the invariants that must hold
avoid_when:
  - No realistic staging environment; production-only systems
  - Telemetry too coarse to attribute problems (see Agent-Legible Systems)
  - Budgets that can't absorb continuous agent runs for days or weeks

tradeoffs:
  latency:     { score: 3, note: "Days to weeks of continuous rounds before launch" }
  cost:        { score: 4, note: "Continuous inference plus staging at scale" }
  complexity:  { score: 4, note: "Harness, fault injection, reviewer, flags, approvals" }
  reliability: { score: 5, note: "Failure modes rehearsed before users meet them" }
gains:
  - Launch-scale behavior known before launch
  - Many more fix cycles than a team could run by hand
  - Fixes arrive behind flags, so production mitigation needs no deploy
costs:
  - Inference spend can run high, especially while the loop is being set up
  - Needs a production-like staging environment
  - Wrong but plausible fixes waste rounds without good attribution

example:
  scenario: The Linkwatch team expects launch traffic around 20× today's level. It runs a hardening loop on staging for two weeks.
  steps:
    - who: Invariants
      what: "The team writes 3: link pages load in under 300 ms at the 95th percentile; a saved link is never lost; a node restart recovers within 30 seconds."
    - who: Scenario
      what: "The harness pushes link creation to 10× expected peak and kills a server mid-run. Save latency triples and a few saves are lost."
    - who: Agent
      what: "Reads the per-query telemetry: one insert scans the whole table to check for duplicates. It proposes an index (easy to undo) or a schema change (hard to undo) and recommends the index."
    - who: Review + ship
      what: "A reviewer agent checks the index change. It ships to staging behind a flag. The rerun holds all 3 invariants."
    - who: Person decides
      what: "A later round suggests changing how link history is stored. That's hard to undo, so the agent presents 3 options and the tech lead picks one."

failures:
  - failure: Goal drift
    symptom: After many rounds, the agent optimizes something nobody asked for
    fix: Keep invariants and outcome fixed and restate them every round
  - failure: Plausible wrong fix
    symptom: Change looks right but the next run shows no improvement
    fix: Require attributable telemetry; drop fixes the rerun doesn't confirm
  - failure: Runaway spend
    symptom: Loop runs all night on low-value scenarios
    fix: Spend budget per scenario; pause when rounds stop improving
  - failure: Irreversible change slips through
    symptom: Agent changes schema or storage format on its own
    fix: Hard-to-undo changes need a person; tooling blocks them otherwise

related:
  - { type: Requires, pattern: agent-legible-systems }
  - { type: Requires, pattern: invariant-anchored-goals }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: orchestrator-workers }
  - { type: Analog of, pattern: evaluator-optimizer }
---
