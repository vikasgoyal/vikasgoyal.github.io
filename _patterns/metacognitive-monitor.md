---
title: Metacognitive Monitor
n: 37
family: fastslow
maturity: hor
axes: [verification]
intent: A lightweight watcher spots surprises and switches the agent into System 2 mode.
aka: surprise detector, agent watchdog, run-time monitor
status: full

problem: >-
  An agent running in fast mode doesn't notice when things stop making sense. Tool results
  contradict each other, the same step repeats, or the plan quietly stops fitting the facts,
  and the agent keeps going with confidence. By the time the final output is checked,
  the run has wasted time or taken wrong actions.
forces:
  - Most runs are routine and need no deep thinking.
  - Trouble shows up mid-run, in signals a final check sees too late.
  - The agent is a poor judge of its own confusion.
  - A watcher that interrupts too often slows everything down.

solution: >-
  Run a separate, cheap monitor alongside the agent that reads its trace after every step.
  The monitor looks for specific surprise signals: a tool result that contradicts an earlier
  one, a repeated action, an unexpected error, output that breaks a known rule, or progress
  stalling against the plan. When a signal fires, the monitor pauses the fast loop and hands
  the current state to System 2 to diagnose it, replan or escalate to a human. The monitor
  itself uses rules and a small model, never the expensive one.

diagram: metacognitive-monitor
diagram_caption: The monitor watches the trace, not the final answer. It catches trouble mid-run and is cheap enough to run on every step.

use_when:
  - Long-running or multi-step agents where mid-run errors compound
  - Agents that take real actions in other systems
  - You can name concrete warning signs from past failures
  - Fast mode is right most of the time but fails in recognizable ways
avoid_when:
  - Short, single-call tasks; check the output instead
  - You can't define surprise signals, so the monitor just guesses
  - Every step already runs on a reasoning model

tradeoffs:
  latency:     { score: 2, note: "Cheap per-step check; slow path only on alerts" }
  cost:        { score: 2, note: "Rules and a small model; System 2 on demand" }
  complexity:  { score: 3, note: "Trace access, signals and pause/resume" }
  reliability: { score: 4, note: "Catches problems while they can still be fixed" }
gains:
  - Problems caught mid-run instead of after the damage
  - Reasoning effort spent exactly where the run got confusing
  - Alert logs give a catalog of real failure modes
costs:
  - Signals need tuning; too sensitive and the agent stalls
  - Pause/resume needs a clean way to hand over state
  - Novel failures that match no signal still slip through

example:
  scenario: An IT operations agent fixes a failing nightly data sync by running checks and restarting services.
  steps:
    - who: Agent (fast)
      what: "Step 1 checks the sync job and finds it failed with a timeout. Step 2 restarts the connector service."
    - who: Monitor
      what: "Step 3 checks the job again and gets the same timeout. Signal: `repeated_failure_after_fix`. The run pauses."
    - who: System 2
      what: "Reads the trace and log tail, and notices the source database password expired 2 days ago. The timeouts were auth retries. It replans: stop restarting and open a credentials ticket."
    - who: Agent
      what: "Opens the ticket with the evidence attached and notifies the on-call engineer."
    - who: Monitor log
      what: "Without the monitor, the fast loop would have restarted the service until it hit its step cap of 8. The alert added about 25 seconds and avoided 5 useless restarts."

failures:
  - failure: Alert fatigue
    symptom: Monitor fires on normal variation; runs crawl
    fix: Tune thresholds on recorded runs; track false-alarm rate
  - failure: Blind to new failures
    symptom: A new kind of problem matches no signal
    fix: Review failed runs monthly and add signals from them
  - failure: Messy handover
    symptom: System 2 misreads the situation from a partial trace
    fix: Hand over a structured state summary plus the raw trace
  - failure: Monitor shares the agent's blind spot
    symptom: Uses the same model and misses the same contradictions
    fix: Base core signals on rules and data, not model judgment

related:
  - { type: Combines with, pattern: fast-slow-escalation }
  - { type: Combines with, pattern: react }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: plan-and-execute }
  - { type: Combines with, pattern: adaptive-thinking }
---
