---
title: Context Compaction
n: 16
family: context
maturity: est
axes: [context]
intent: Summarize or prune history so long tasks fit the context window.
aka: context summarization, history pruning, rolling summary
status: full

problem: >-
  Long-running agents accumulate turns, tool outputs and intermediate results until the
  context window fills. Before it's full, quality already drops: the model loses track of
  early instructions, attends to stale details and gets slower and more expensive with
  every step.
forces:
  - Long tasks need to remember decisions made early on.
  - Most old tool output is no longer relevant.
  - Summaries lose detail that sometimes turns out to matter.
  - Compacting itself takes a model call and time.

solution: >-
  Watch context size and compact before it becomes a problem. Keep the essentials verbatim:
  the task, constraints, key decisions and open items. Replace old turns and bulky tool
  outputs with short summaries that record what was learned, not the raw data. Drop
  results that have been superseded. Save full raw history outside the context, in a file or
  store, so the agent can look up a detail if it needs it later. Trigger compaction at a set
  threshold, such as 70% of the window, or at natural breakpoints between subtasks.

diagram: context-compaction
diagram_caption: Compaction keeps the decisions and drops the bulk. The raw history moves to storage, so nothing is truly lost.

use_when:
  - Agents run for many steps or hours
  - Tool outputs are large (logs, documents, search results)
  - Early instructions or decisions must stay in force throughout
  - Cost and latency rise noticeably as context grows
avoid_when:
  - Short tasks that never approach the context limit
  - Every detail must stay exact, like legal text under review; use retrieval instead
  - You can't store the raw history for later lookup

tradeoffs:
  latency:     { score: 2, note: "Occasional summarization pass; faster steps after" }
  cost:        { score: 1, note: "Smaller contexts on every following step" }
  complexity:  { score: 3, note: "Thresholds, what to keep, raw-history store" }
  reliability: { score: 3, note: "Good if decisions are kept verbatim; risk of lost detail" }
gains:
  - Long tasks keep running without hitting the limit
  - Steady cost and latency per step
  - The model stays focused on what currently matters
costs:
  - Details dropped in a summary may be needed later
  - Bad summaries can distort earlier decisions
  - Extra calls and logic to manage

example:
  scenario: A coding agent spends 3 hours migrating 40 API endpoints to a new authentication library.
  steps:
    - who: Steps 1–60
      what: "Context grows to about 70% of the window, mostly test output and file contents from endpoints already finished."
    - who: Compaction
      what: "Keeps the task, the rule “never change public response formats”, the chosen token-refresh approach and the 3 open issues word for word. It replaces 25 finished endpoints with one line each, such as “/orders: migrated, 18 tests pass.”"
    - who: Storage
      what: "The full raw log is saved to a progress file. Context drops to about 25% of the window."
    - who: Step 140
      what: "A test fails on /refunds with an error seen earlier. The agent searches the progress file, finds how it fixed the same error on /orders, and reuses the fix."
    - who: Result
      what: "All 40 endpoints migrated in one run. Per-step cost stayed flat instead of rising with each step."

failures:
  - failure: Lost key decision
    symptom: Agent reverses a choice made early in the task
    fix: Keep decisions and constraints verbatim, never summarized
  - failure: Over-compression
    symptom: Agent repeats work because the summary was too vague
    fix: Record what was done and its result, not just "worked on X"
  - failure: No way back to details
    symptom: Needed detail exists only in the discarded history
    fix: Save raw history externally and give the agent a search tool for it
  - failure: Compacting too late
    symptom: Quality already degraded before compaction runs
    fix: Compact at a threshold well below the limit, or between subtasks

related:
  - { type: Combines with, pattern: tiered-memory }
  - { type: Alternative, pattern: context-isolation }
  - { type: Combines with, pattern: react }
  - { type: Provided by, pattern: agent-harness }
  - { type: Combines with, pattern: agentic-rag }
---
