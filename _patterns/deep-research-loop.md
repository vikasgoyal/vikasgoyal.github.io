---
title: Deep Research Loop
n: 49
family: core
maturity: est
axes: [decision, context]
intent: Iteratively plan, search, read and assess until new sources stop adding information, then write a cited synthesis.
aka: deep research, research agent, iterative research
status: full

problem: >-
  Some questions can't be answered from one search or one retrieval pass: market scans,
  technical comparisons, due diligence, literature reviews. A single pass finds the obvious
  sources and misses the rest, while an open-ended agent keeps searching long after it has
  enough, or stops early and presents a thin answer as complete.
forces:
  - Good research needs many searches, and each answer raises new questions.
  - Every round costs time and tokens, with diminishing returns.
  - Sources conflict, repeat each other or vary widely in quality.
  - Readers need to check claims, so every statement needs a source.

solution: >-
  Run research as a loop with an explicit stopping rule. First break the question into
  sub-questions and a research plan. Each round, search, read the most promising sources
  and extract findings with their citations into a running notes file. Then assess: which
  sub-questions are answered, where sources conflict, and what's still missing. Plan the next
  round around the gaps. Stop when a round adds little new information, all sub-questions
  are covered, or the budget runs out. Finally, write a synthesis where every claim cites its
  source and open questions or conflicts are stated, not hidden.

diagram: deep-research-loop
diagram_caption: The assess step drives everything. It decides what to search next and when new rounds are no longer worth their cost.

use_when:
  - Questions that need many sources to answer well
  - The reader needs citations they can check
  - Minutes of runtime are acceptable for a better answer
  - Reports, briefs, comparisons or due diligence
avoid_when:
  - A single lookup or one retrieval pass answers the question; use Agentic RAG
  - Answers are needed in seconds
  - Sources are behind access the agent doesn't have, so the loop can only find surface material

tradeoffs:
  latency:     { score: 5, note: "Several rounds of search and reading; minutes, not seconds" }
  cost:        { score: 4, note: "Many searches and long reads per question" }
  complexity:  { score: 3, note: "Sub-questions, notes file, stopping rule, citations" }
  reliability: { score: 4, note: "Broad coverage with checkable sources" }
gains:
  - Covers a topic far more broadly than a single search
  - Every claim traceable to a source
  - Explicit gaps and conflicts instead of false confidence
costs:
  - Slow and expensive per question
  - Source quality varies; weak sources can dominate if not filtered
  - Stopping rules need tuning to avoid quitting early or looping on

example:
  scenario: A solutions architect asks how mid-size insurers are using AI agents in claims handling, for a customer briefing.
  steps:
    - who: Plan
      what: "Splits the question into 4 sub-questions: use cases in production, measured results, regulatory concerns, and common failure points."
    - who: Round 1
      what: "Runs 8 searches and reads 12 sources. Use cases and failure points are covered, but measured results come only from vendor marketing."
    - who: Assess
      what: "Flags a gap: no independent results. Flags a conflict: two sources disagree on whether claims agents may approve payouts on their own."
    - who: Round 2
      what: "Targets industry association reports and regulator guidance. Reads 7 more sources, which resolve the payout question: human approval is expected above a threshold."
    - who: Round 3 → stop
      what: "Adds only 1 new finding from 6 sources. Information gain is below the stop threshold, so the loop ends."
    - who: Synthesis
      what: "A 2-page brief with 24 citations. It states one open question plainly: independent ROI data is still scarce."

failures:
  - failure: Never-ending research
    symptom: Rounds keep running with little new information
    fix: Stop on low information gain, full coverage or budget, whichever comes first
  - failure: Shallow stop
    symptom: Answer written after one round, missing whole sub-questions
    fix: Check every sub-question is answered or marked open before writing
  - failure: Source echo
    symptom: Many sources repeating one original claim count as consensus
    fix: Trace claims to their original source; weight independent sources
  - failure: Unsupported synthesis
    symptom: The final write-up adds claims no source made
    fix: Require a citation per claim; verify with Draft–Verify

related:
  - { type: Builds on, pattern: agentic-rag }
  - { type: Combines with, pattern: budget-aware-planning }
  - { type: Scales with, pattern: orchestrator-workers }
  - { type: Combines with, pattern: draft-verify }
  - { type: Combines with, pattern: context-compaction }
---
