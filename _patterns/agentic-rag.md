---
title: Agentic RAG
n: 14
family: context
maturity: est
axes: [context]
intent: The agent decides when and what to retrieve, rewrites queries and checks relevance.
aka: active retrieval, iterative RAG, retrieval as a tool
status: full

problem: >-
  Classic retrieval-augmented generation runs one search with the user's exact words and
  stuffs the top results into the prompt. That fails when the question is vague, needs
  facts from several sources, uses different wording than the documents, or doesn't need
  retrieval at all. The model then answers from whatever came back, relevant or not.
forces:
  - User questions rarely match how documents are written.
  - Complex questions need several searches, often in different sources.
  - Irrelevant retrieved text misleads the model and wastes context.
  - Each extra search adds latency and cost.

solution: >-
  Make retrieval a set of tools the agent controls instead of a fixed first step. The agent
  decides whether it needs to retrieve, which source to search (documents, tickets, a
  database), and how to phrase the query, splitting complex questions into sub-queries. It
  grades what comes back for relevance, discards weak results, and rewrites the query or
  tries another source when results are poor. It answers only from passages it kept, with
  a citation for each claim, and says so when it can't find support.

diagram: agentic-rag
diagram_caption: Retrieval is a loop the agent controls. Grading results before answering is what separates this from one-shot RAG.

use_when:
  - Questions vary widely in wording and complexity
  - Answers often need facts from more than one source
  - Users need citations they can check
  - Bad answers from irrelevant context are costly
avoid_when:
  - Simple lookups where one search reliably works
  - Strict latency budgets that can't absorb extra searches
  - The whole corpus fits in the context window; just include it

tradeoffs:
  latency:     { score: 3, note: "Multiple searches and grading steps" }
  cost:        { score: 3, note: "More calls, but less irrelevant context per call" }
  complexity:  { score: 3, note: "Retrieval tools, grading and query rewriting" }
  reliability: { score: 4, note: "Grounded, cited answers; admits when it can't find support" }
gains:
  - Handles vague and multi-part questions far better than one-shot search
  - Citations make answers verifiable
  - Can say "I couldn't find this" instead of guessing
costs:
  - Slower than single-pass retrieval
  - Grading quality limits answer quality
  - Retrieval loops can wander without a step limit

example:
  scenario: An internal assistant answers employee questions from HR policies, benefits documents and past HR tickets.
  steps:
    - who: Employee
      what: "“Can I use my learning budget for a conference in Europe, and does the travel count against it?”"
    - who: Agent
      what: "Splits this into two sub-queries: learning budget eligible expenses, and conference travel policy. It searches the policy documents first."
    - who: Grader
      what: "Keeps 2 of 6 passages. Drops a 2023 version of the policy, which has a newer replacement, and an unrelated passage on team offsites."
    - who: Agent
      what: "The travel question isn't answered by policy text. It rewrites the query and searches HR tickets, finding 3 resolved tickets about the same case."
    - who: Answer
      what: "Yes for the conference fee, up to the $2,000 annual budget. Travel is covered separately by the travel policy and needs manager approval. Each sentence cites a policy section or ticket."

failures:
  - failure: Retrieval when not needed
    symptom: Simple questions slowed down by unnecessary searches
    fix: Let the agent answer directly when no retrieval is needed; measure it
  - failure: Stale or conflicting sources
    symptom: Answer mixes an old policy with a new one
    fix: Store version and date metadata; prefer the latest; flag conflicts
  - failure: Weak grading
    symptom: Irrelevant passages kept and quoted
    fix: Grade each passage against the specific sub-question
  - failure: Unsupported claims
    symptom: Answer goes beyond what retrieved text says
    fix: Require a citation per claim; check with Draft–Verify

related:
  - { type: Builds on, pattern: tool-use }
  - { type: Runs as, pattern: react }
  - { type: Combines with, pattern: draft-verify }
  - { type: Combines with, pattern: context-compaction }
  - { type: Combines with, pattern: tiered-memory }
---
