---
title: Prompt Chaining
n: 5
family: core
maturity: est
axes: [decision]
intent: A fixed sequence of LLM calls with checks between steps. Predictable and debuggable.
aka: pipeline, sequential workflow, LLM chain
status: full

problem: >-
  One large prompt that asks a model to extract, analyze, decide and write all at once is
  hard to get right and harder to debug. When the output is wrong, you can't tell which part
  of the job failed, and small prompt changes have unpredictable effects.
forces:
  - Smaller, focused prompts are more accurate than one prompt doing everything.
  - Each extra call adds latency and a place for errors to compound.
  - Fixed steps are predictable but can't adapt to unusual inputs.
  - Teams need to test and improve each part independently.

solution: >-
  Break the task into a fixed sequence of steps, each a separate LLM call with one job and
  a defined output format. Code, not the model, decides the order. Between steps, add gates:
  cheap programmatic checks such as schema validation, required fields or length limits.
  A failed gate stops the chain, retries the step or flags it for review, so a bad
  intermediate result never reaches the next step.

diagram: prompt-chaining
diagram_caption: Code controls the sequence. Gates between steps stop bad intermediate output from reaching later steps.

use_when:
  - The task always breaks into the same steps
  - Each step's output can be checked with code
  - You need predictable cost, latency and behavior
  - Different steps benefit from different prompts or models
avoid_when:
  - The steps depend on what earlier results reveal; use ReAct
  - The task is simple enough for one well-written prompt
  - Inputs vary so much that a fixed sequence often doesn't fit

tradeoffs:
  latency:     { score: 3, note: "Steps run in sequence; total grows with length" }
  cost:        { score: 2, note: "Predictable; small models can handle simple steps" }
  complexity:  { score: 2, note: "Plain code orchestration, no agent loop" }
  reliability: { score: 4, note: "Each step is testable; gates catch drift" }
gains:
  - Each step can be tested, measured and improved on its own
  - Predictable cost and latency per run
  - Failures point to a specific step
costs:
  - Rigid; unusual inputs don't fit the fixed path
  - Errors that pass a gate still compound downstream
  - More prompts to maintain

example:
  scenario: A pipeline turns customer call transcripts into CRM updates for an account team.
  steps:
    - who: Step 1 · Extract
      what: "A small model pulls facts as JSON: `{competitors: [\"Acme\"], budget: \"Q2\", next_meeting: \"2026-11-20\", action_items: [...]}`."
    - who: Gate
      what: Schema check passes. A date check confirms the next meeting isn't in the past.
    - who: Step 2 · Classify
      what: "Labels the deal risk from the extracted facts: `risk: medium, reason: competitor mentioned twice`."
    - who: Step 3 · Draft
      what: Writes a 4-line CRM note and a follow-up email draft from steps 1–2 only, not from the raw transcript.
    - who: Gate
      what: "On a different call, the extraction returns `next_meeting: \"next Tuesday\"`. The date check fails, the chain stops, and the record is queued for a quick human fix instead of writing a bad date to CRM."

failures:
  - failure: Error compounding
    symptom: A small extraction error becomes a confident wrong summary
    fix: Gate each step's output; pass structured data, not prose
  - failure: Wrong decomposition
    symptom: Steps need information an earlier step discarded
    fix: Carry the original input alongside intermediate results where needed
  - failure: Brittle to unusual inputs
    symptom: Edge cases fail gates constantly
    fix: Route unusual inputs to a separate path or to ReAct
  - failure: Prompt drift between steps
    symptom: One step's format changes and breaks the next
    fix: Version step contracts; test the chain end-to-end in CI

related:
  - { type: Alternative, pattern: react }
  - { type: Combines with, pattern: routing }
  - { type: Combines with, pattern: guardrails }
  - { type: Generalizes to, pattern: plan-and-execute }
  - { type: Combines with, pattern: parallelization }
---
