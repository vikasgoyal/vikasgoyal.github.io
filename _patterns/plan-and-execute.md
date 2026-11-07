---
title: Plan-and-Execute
n: 3
family: core
maturity: est
axes: [decision]
intent: Write the plan first, then execute step by step and replan on failure.
aka: planner–executor, plan-then-act, task decomposition
status: full

problem: >-
  On multi-part tasks, a step-by-step loop like ReAct makes greedy choices: it starts
  working before it has seen the whole job, repeats work, and loses track of which parts
  are done. Long tasks also get expensive when a large model re-reads the entire history
  for every small step.
forces:
  - Multi-part tasks benefit from seeing the whole job before starting.
  - Plans go stale as soon as a step returns something unexpected.
  - Strong reasoning is needed for planning but not for each small step.
  - Users and reviewers want to see the plan before anything runs.

solution: >-
  Split the work into two roles. A planner, usually the strongest model, turns the goal into
  an ordered list of steps with clear completion criteria. An executor, often a cheaper
  model with tools, runs one step at a time and records the result. When a step fails or
  returns something that invalidates the plan, control goes back to the planner, which
  revises only the remaining steps.

diagram: plan-and-execute
diagram_caption: The plan is a visible artifact that people can review or edit. Replanning touches only the steps that haven't run yet.

use_when:
  - Tasks have several distinct parts, like research, compare, then draft
  - You want a human to approve the plan before anything runs
  - Execution steps are simple enough for a cheaper model
  - Progress needs to be tracked or resumed after an interruption
avoid_when:
  - The task is one or two steps; planning is overhead
  - The environment is so unpredictable that every plan breaks immediately
  - Steps are tightly coupled and can't be described independently

tradeoffs:
  latency:     { score: 3, note: "Planning adds an upfront call; steps can run faster" }
  cost:        { score: 2, note: "Expensive model plans once; cheap model executes" }
  complexity:  { score: 3, note: "Plan format, state tracking and replanning" }
  reliability: { score: 4, note: "Fewer missed parts; progress is checkable" }
gains:
  - Fewer missed or duplicated parts on long tasks
  - A reviewable plan, which is also a natural approval point
  - Lower cost by putting the strong model only on planning
costs:
  - Plans can be confidently wrong about the environment
  - Replanning logic adds state to manage
  - The executor may lack context the planner assumed

example:
  scenario: An account team asks an agent to prepare a quarterly business review (QBR) brief for a customer.
  steps:
    - who: Planner
      what: "Writes 4 steps: (1) pull usage for the last 90 days, (2) list open support cases, (3) find renewal and expansion dates in CRM, (4) draft a one-page brief with risks and opportunities."
    - who: Account lead
      what: "Approves the plan and adds one step: include NPS comments from the last survey."
    - who: Executor
      what: "Steps 1–3 complete. Usage is up 18%, there are 2 open P2 cases, and renewal is in March."
    - who: Executor
      what: "The new NPS step fails because the survey tool has no data for this account. The step is marked `blocked` and sent back to the planner."
    - who: Planner
      what: Replans the remaining steps by dropping NPS, adding a note to the brief that survey data is missing, and continuing with the draft.
    - who: Run log
      what: Stores the plan, each step's output and the replan. The account lead sees exactly why NPS is missing.

failures:
  - failure: Plan built on wrong assumptions
    symptom: Steps reference data or tools that don't exist
    fix: Give the planner the real tool list; validate steps before running
  - failure: Stale plan
    symptom: Executor keeps following a plan that no longer fits
    fix: Define replan triggers, such as step failure or an unexpected result
  - failure: Lost context between roles
    symptom: Executor misreads a step the planner meant differently
    fix: Write each step with inputs, expected output and done criteria
  - failure: Replan thrash
    symptom: Planner rewrites the whole plan on every hiccup
    fix: Only replan remaining steps; cap replans per run

related:
  - { type: Alternative, pattern: react }
  - { type: Grows into, pattern: orchestrator-workers }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: budget-aware-planning }
  - { type: Combines with, pattern: fast-slow-escalation }
---
