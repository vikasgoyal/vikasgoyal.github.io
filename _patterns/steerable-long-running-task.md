---
title: Steerable Long-Running Task
n: 52
family: runtime
maturity: emg
axes: [decision, coordination]
intent: Long tasks run in the background with visible progress, checkpoints, and controls to pause, resume, cancel or redirect mid-flight.
aka: background agent task, steerable agent, interruptible run
status: full

problem: >-
  Agents now take on work that runs for many minutes or hours: research reports, data
  migrations, large refactors, multi-step workflows. Users either wait blind or walk away
  and come back to a finished result built on a wrong assumption from minute two. If they
  notice a problem halfway, their only option is to cancel and lose everything done so far.
forces:
  - Long tasks are where agents save the most time.
  - Users learn things mid-task that should change the direction.
  - Stopping and restarting wastes the work already done.
  - Changing direction mid-step can leave work half-finished and inconsistent.

solution: >-
  Run long tasks as background jobs with a visible plan and progress: current step, steps
  done, findings so far and budget used. Save a checkpoint after each step so the task can
  pause, survive restarts and resume where it left off. Give the user four controls: pause,
  resume, cancel (keeping completed results) and steer, a short instruction like "skip
  Europe" or "focus on cost". Steering takes effect at the next checkpoint, not mid-step: the
  agent finishes or rolls back the current step, revises the remaining plan, shows the change
  and continues. Every steer is logged with the plan change it caused.

diagram: steerable-long-running-task
diagram_caption: Steering takes effect at checkpoints, so the task never stops halfway through a step. Completed work is kept when the direction changes.

use_when:
  - Tasks that run for many minutes or hours
  - Users are likely to refine what they want as results appear
  - Work done so far is valuable and shouldn't be thrown away on a change
  - Users switch away and come back, on the same or another device
avoid_when:
  - Tasks that finish in seconds; just rerun them
  - Steps that can't be checkpointed or rolled back safely
  - Fully specified batch jobs where nobody will watch or steer

tradeoffs:
  latency:     { score: 2, note: "Users keep working; steering avoids full restarts" }
  cost:        { score: 2, note: "Checkpoint storage; less wasted rework" }
  complexity:  { score: 4, note: "Job runner, checkpoints, steering, plan revision, progress UI" }
  reliability: { score: 4, note: "Survives restarts; course corrections without starting over" }
gains:
  - Users catch wrong directions early without losing completed work
  - Long tasks survive restarts, sleep and network drops
  - A clear record of how the task's direction changed and why
costs:
  - Real engineering for checkpoints and resumable state
  - Steering instructions can conflict with work already done
  - Progress UI and notifications need design care

example:
  scenario: An analyst starts a background task to build a competitor landscape across 12 vendors, estimated at about 40 minutes.
  steps:
    - who: Start
      what: "The agent shows its plan of 12 vendor profiles, a comparison table and a summary. It starts working; progress shows 0 of 12."
    - who: Progress (minute 9)
      what: "3 of 12 vendors are done, and their profiles are already viewable. The analyst notices the profiles focus on features, but the customer cares about pricing models."
    - who: Steer
      what: "The analyst types: “Focus on pricing and licensing, keep features brief.” The agent finishes vendor 4 at the next checkpoint, then revises the plan and shows it: remaining profiles are pricing-first, and vendors 1–4 get a short pricing pass."
    - who: Pause / resume
      what: "The analyst pauses the task before a meeting. The laptop sleeps for an hour. On resume, the task continues from the vendor 6 checkpoint with nothing lost."
    - who: Done
      what: "All 12 vendors are finished with a pricing comparison. The run log shows 1 steer and 1 pause. Total runtime was 46 minutes instead of an estimated 70 for a cancel and restart."

failures:
  - failure: Blind runs
    symptom: Users can't tell what the agent is doing or how far along it is
    fix: Visible plan, step progress and partial results
  - failure: Mid-step interruption
    symptom: Steering corrupts half-written output
    fix: Apply steering only at checkpoints; finish or roll back the current step
  - failure: Steer ignored or misapplied
    symptom: Agent keeps the old direction or overcorrects
    fix: Show the revised plan after each steer for a quick confirmation
  - failure: Lost work on cancel
    symptom: Cancel throws away completed steps
    fix: Cancel keeps checkpointed results and marks what's incomplete

related:
  - { type: Builds on, pattern: plan-and-execute }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: budget-aware-planning }
  - { type: Combines with, pattern: talker-reasoner }
  - { type: Provided by, pattern: agent-harness }
---
