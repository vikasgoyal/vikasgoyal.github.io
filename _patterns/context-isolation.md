---
title: Sub-agent Context Isolation
n: 17
family: context
maturity: emg
axes: [context, coordination]
intent: A sub-agent explores in a clean context and returns only a summary.
aka: subagent delegation, context firewall, scratch context
status: full

problem: >-
  Some steps generate huge amounts of intermediate material, like reading 30 files to find
  one function, browsing a dozen pages for one fact, or trying several failed approaches.
  If the main agent does this itself, its context fills with noise that it carries for the
  rest of the task, crowding out what matters.
forces:
  - Exploration produces far more text than the answer it finds.
  - The main agent needs to stay focused on the overall task.
  - A sub-agent starting fresh lacks context the main agent has.
  - Every sub-agent adds startup cost and a summary that may miss details.

solution: >-
  When a step is exploratory and self-contained, the main agent spawns a sub-agent with a
  fresh context and a precise brief: what to find, where to look, and what to return. The
  sub-agent does all the reading and trial-and-error in its own context. It returns only a
  short, structured result, such as the answer, key evidence and file or source references.
  Its working context is then discarded. The main agent's context grows by a paragraph
  instead of thousands of lines.

diagram: context-isolation
diagram_caption: The sub-agent's context is thrown away when it finishes. Only the short result crosses back into the main agent's context.

use_when:
  - A step needs heavy reading or searching to produce a small answer
  - Exploration involves trial and error the main agent doesn't need to see
  - The main task is long and its context is precious
  - The step can be described clearly without the main agent's full history
avoid_when:
  - The step needs the main agent's full context to be done right
  - The exploration is small enough to just do inline
  - Many tightly linked steps would each need their own sub-agent

tradeoffs:
  latency:     { score: 2, note: "Sub-agent startup; can run in parallel" }
  cost:        { score: 3, note: "Sub-agent tokens, but the main context stays small" }
  complexity:  { score: 2, note: "A brief, a return format and a spawn tool" }
  reliability: { score: 4, note: "Main agent stays focused; risk of thin summaries" }
gains:
  - The main agent's context stays small and focused
  - Exploratory dead ends don't pollute the main task
  - Exploration can run in parallel across several sub-agents
costs:
  - Sub-agents may miss context the main agent had
  - Summaries can drop a detail the main agent later needs
  - More moving parts to trace when debugging

example:
  scenario: A coding agent is fixing a bug where invoices show the wrong currency for some EU customers.
  steps:
    - who: Main agent
      what: "Needs to know where currency is chosen. It spawns a sub-agent with the brief: “find where invoice currency is set; return file, function and the rule used; under 150 words.”"
    - who: Sub-agent
      what: "Searches the codebase, reads 23 files and 2 config files, and follows one dead end in a deprecated module. That's about 60,000 tokens of reading."
    - who: Sub-agent result
      what: "Returns 6 lines: currency is set in `billing/pricing.py`, `resolve_currency()`, from the billing country, with a fallback to the company's home country when the country code is missing. EU customers created before 2024 have no country code."
    - who: Main agent
      what: "Its context grew by about 150 tokens. It writes the fix and a data backfill using the precise location it was given."
    - who: Comparison
      what: "Doing the search inline would have added about 60,000 tokens to the main context for the rest of the task."

failures:
  - failure: Under-specified brief
    symptom: Sub-agent explores the wrong thing or returns the wrong shape
    fix: Brief states goal, scope, return format and length limit
  - failure: Thin summary
    symptom: Main agent has to redo the exploration for a missing detail
    fix: Return references (files, links) so details can be fetched directly
  - failure: Over-delegation
    symptom: Sub-agents spawned for trivial lookups
    fix: Only isolate steps that would add substantial context
  - failure: Hidden assumptions
    symptom: Sub-agent misses a constraint the main agent knew
    fix: Pass relevant constraints explicitly in the brief

related:
  - { type: Enables, pattern: orchestrator-workers }
  - { type: Alternative, pattern: context-compaction }
  - { type: Combines with, pattern: parallelization }
  - { type: Provided by, pattern: agent-harness }
  - { type: Combines with, pattern: agentic-rag }
---
