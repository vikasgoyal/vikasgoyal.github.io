---
title: ReAct
n: 2
family: core
maturity: est
axes: [decision, tool]
intent: Reason, act, observe, repeat. The default loop in most agent frameworks.
aka: Reason + Act, thought–action–observation loop, agent loop
status: full

problem: >-
  Many tasks can't be solved in one tool call, because what to do next depends on what the
  last call returned. A fixed script can't adapt, and asking the model to plan everything
  up front breaks as soon as reality differs from the plan.
forces:
  - The next step depends on results the agent hasn't seen yet.
  - Reasoning out loud improves choices but costs tokens on every turn.
  - An open-ended loop can wander, repeat itself or never stop.
  - Each iteration adds latency the user waits through.

solution: >-
  Run a loop. On each turn the model writes a short thought about what it knows and what it
  needs, picks one action (a tool call), and reads the observation that comes back. The
  observation is appended to the context, and the loop repeats until the model decides it
  can answer. The runtime enforces a step limit and stops the loop on repeated identical
  actions.

diagram: react
diagram_caption: One tool call per turn, with the result fed back before the next decision. The step cap is the main safety valve.

use_when:
  - The path to the answer isn't known in advance
  - Each step is cheap and the task needs 2–10 of them
  - You need a readable trace of why the agent did what it did
  - Tools return information that changes what to try next
avoid_when:
  - The steps are always the same; use Prompt Chaining instead
  - Tasks need dozens of steps; plan first or use Code-as-Action
  - Latency must stay under a second or two

tradeoffs:
  latency:     { score: 3, note: "One model turn per step, run in sequence" }
  cost:        { score: 3, note: "Context grows with every observation" }
  complexity:  { score: 2, note: "Supported out of the box by most frameworks" }
  reliability: { score: 3, note: "Good on short tasks; drifts on long ones" }
gains:
  - Adapts to what tools actually return
  - The trace of thoughts and actions is easy to debug
  - Works with any set of tools without task-specific code
costs:
  - Context grows each step, raising cost and diluting attention
  - Can loop or repeat actions without a stop rule
  - Greedy, step-by-step choices can miss a better overall plan

example:
  scenario: A sales-ops agent answers "Why did the Contoso renewal slip?" using CRM, email search and a support-ticket tool.
  steps:
    - who: Thought
      what: I need the renewal record first to see the dates and the owner.
    - who: Action → Observation
      what: "`crm.get_opportunity(\"Contoso renewal\")` returns close date moved from Sep 30 to Nov 15, with stage stuck at Legal review."
    - who: Thought
      what: Legal review stalled. I'll check emails for the reason.
    - who: Action → Observation
      what: "`email.search(\"Contoso DPA\", after=\"Sep 1\")` finds that the customer requested a revised data processing agreement on Sep 22."
    - who: Thought
      what: That explains the slip. I'll check whether open support issues are also adding friction, then answer.
    - who: Action → Answer
      what: "`tickets.search(account=\"Contoso\", status=\"open\")` returns 1 low-priority ticket. The agent answers: the slip is a DPA revision request, not product issues. Four steps and 3 tool calls."

failures:
  - failure: Infinite loop
    symptom: Same tool called with the same arguments over and over
    fix: Step cap plus duplicate-action detection
  - failure: Context bloat
    symptom: Long tool outputs crowd out the task; answers degrade
    fix: Trim or summarize observations before appending
  - failure: Premature answer
    symptom: Stops after one call with a confident but incomplete answer
    fix: State completion criteria in the prompt; check with Reflection
  - failure: Short-sighted steps
    symptom: Ten small calls where one planned query would do
    fix: Switch to Plan-and-Execute for multi-part tasks

related:
  - { type: Builds on, pattern: tool-use }
  - { type: Alternative, pattern: plan-and-execute }
  - { type: Combines with, pattern: reflection }
  - { type: Combines with, pattern: context-compaction }
  - { type: Runs inside, pattern: agent-harness }
---
