---
title: Orchestrator–Workers
n: 8
family: multi
maturity: est
axes: [coordination]
intent: A lead agent decomposes the task at runtime, delegates, and merges results.
aka: lead agent + subagents, manager–worker, dynamic fan-out
status: full

problem: >-
  Some tasks are too big for one agent's context and too unpredictable for a fixed pipeline.
  You can't know in advance how many parts a research question or a codebase change will
  have, so you can't hard-code the split, yet one agent working through it alone is slow and
  loses track as its context fills up.
forces:
  - The right breakdown depends on the specific task, not a template.
  - Subtasks often run faster in parallel with their own clean context.
  - Workers can't see each other's work, so they may overlap or conflict.
  - Every worker adds tokens; multi-agent runs can cost several times a single agent.

solution: >-
  A lead agent reads the task, decides how to split it, and writes a brief for each worker:
  the goal, the scope boundaries, the tools to use and the output format to return. Workers
  run independently, often in parallel, each in its own context, and return condensed
  results rather than full transcripts. The lead reviews what came back, spawns follow-up
  workers for gaps, and writes the final answer. The lead, not the workers, owns the plan
  and the synthesis.

diagram: orchestrator-workers
diagram_caption: Unlike Parallelization, the split is decided at runtime by the lead. The lead can add a second round of workers when the first round leaves gaps.

use_when:
  - The number and shape of subtasks can't be known in advance
  - Subtasks are broad, like research across many sources or changes across many files
  - Parallel work would cut wall-clock time significantly
  - The full job won't fit in one agent's context
avoid_when:
  - The split is always the same; use Parallelization or Prompt Chaining
  - Subtasks are tightly coupled and need constant coordination
  - The task is small enough that delegation overhead outweighs the gain

tradeoffs:
  latency:     { score: 3, note: "Parallel workers, but planning and synthesis add rounds" }
  cost:        { score: 5, note: "Several agents' worth of tokens per task" }
  complexity:  { score: 4, note: "Briefs, result formats, follow-up rounds" }
  reliability: { score: 4, note: "Strong on broad tasks when briefs are clear" }
gains:
  - Handles open-ended tasks no fixed pipeline could
  - Each worker gets a clean, focused context
  - Broad research or changes finish much faster in parallel
costs:
  - Token cost multiplies with every worker
  - Vague briefs lead to duplicated or missed work
  - The lead's synthesis is a single point of failure

example:
  scenario: A solutions architect asks an agent to compare how five cloud vendors handle agent identity and permissions, for a customer briefing.
  steps:
    - who: Lead
      what: "Splits the task into 5 workers, one per vendor. Each brief says: “find official docs on agent identity, scoped permissions and audit logging; return a 10-line summary with source links; ignore pricing.”"
    - who: Workers
      what: "Run in parallel, each searching and reading 6–12 pages. They return condensed summaries of about 300 words each, not their full browsing history."
    - who: Lead
      what: "Notices that two summaries don't mention audit log retention. Spawns 2 follow-up workers with narrow briefs on just that question."
    - who: Lead
      what: "Writes a comparison table plus 3 key differences, with every claim linked to a source a worker returned."
    - who: Run log
      what: "7 workers in total. Wall-clock time is 6 minutes against an estimated 25 for one agent working alone, at roughly 4× the token cost."

failures:
  - failure: Vague briefs
    symptom: Workers overlap or wander outside their scope
    fix: Each brief states goal, boundaries, tools and return format
  - failure: Over-delegation
    symptom: Dozens of workers spawned for a simple question
    fix: Scale worker count to task size; cap per run
  - failure: Lossy hand-back
    symptom: Workers return summaries that drop the key detail
    fix: Ask for structured results plus source links the lead can check
  - failure: Bad synthesis
    symptom: Final answer contradicts or ignores worker findings
    fix: Require every claim to cite a worker result; check with Reflection

related:
  - { type: Generalizes, pattern: parallelization }
  - { type: Builds on, pattern: context-isolation }
  - { type: Scales into, pattern: hierarchical-supervisor }
  - { type: Grows from, pattern: plan-and-execute }
  - { type: Combines with, pattern: budget-aware-planning }
---
