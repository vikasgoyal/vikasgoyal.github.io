---
title: Tiered Memory
n: 15
family: context
maturity: est
axes: [context]
intent: Working, episodic and semantic memory stored and recalled separately.
aka: agent memory architecture, short-term / long-term memory, memory layers
status: full

problem: >-
  An agent that forgets everything between sessions makes users repeat themselves and
  can't learn from past work. But dumping every past conversation into the prompt is slow,
  expensive and noisy. Different kinds of memory need different storage, lifetimes and
  retrieval.
forces:
  - Users expect the agent to remember facts and preferences across sessions.
  - Raw history grows without limit and is mostly noise.
  - Wrong or stale memories are worse than none.
  - Personal data in memory raises privacy and deletion requirements.

solution: >-
  Split memory into tiers. Working memory is the current context window: the task, recent
  turns and live tool results. Episodic memory stores summaries of past sessions and
  outcomes, retrieved when a similar situation comes up. Semantic memory holds durable facts
  and preferences, such as "prefers metric units" or "account owner is Priya", each with a
  source and a date. A write gate decides what is worth keeping and in which tier. Retrieval
  pulls only the relevant items into working memory at the start of each task. Users can
  view, correct and delete what's stored.

diagram: tiered-memory
diagram_caption: The write gate is as important as the stores. Most of what happens in a session should never become long-term memory.

use_when:
  - Users return over days or weeks and expect continuity
  - Past outcomes can improve future runs
  - Personal preferences change how the agent should respond
  - Sessions are too long or too many to keep in raw form
avoid_when:
  - Single-shot tasks with no returning users
  - You can't offer users a way to view and delete stored memory
  - Stored facts change so quickly that memory is mostly stale

tradeoffs:
  latency:     { score: 2, note: "A retrieval step at task start" }
  cost:        { score: 2, note: "Storage plus summarization of sessions" }
  complexity:  { score: 4, note: "Write gate, three stores, retrieval, deletion" }
  reliability: { score: 3, note: "Good with dated, sourced facts; risky when stale" }
gains:
  - Continuity across sessions without huge prompts
  - Agent improves from its own past outcomes
  - Personalization grounded in stated facts and preferences
costs:
  - Stale or wrong memories mislead future answers
  - Privacy duties for storing personal data
  - Deciding what to keep is a hard, ongoing design problem

example:
  scenario: A personal work assistant used daily by an account manager.
  steps:
    - who: Monday session
      what: "The user says “I always want customer briefs as one page, risks first.” The write gate saves this to semantic memory: `preference: brief format = 1 page, risks first`."
    - who: Monday session
      what: "The user preps for an Acme renewal. At session end, an episodic summary is saved: “Acme renewal prep; legal blocker on DPA; follow up Nov 14.”"
    - who: Write gate
      what: "Skips 40 turns of small talk and lookups. Only the 2 items above are stored."
    - who: Thursday session
      what: "The user asks for an Acme update. Retrieval pulls the Acme episode and the brief preference into working memory. The agent writes a 1-page brief with risks first, opening with the DPA blocker."
    - who: Correction
      what: "The user says the DPA was signed yesterday. The agent updates the episodic note, marks the old fact as superseded and dates the change."

failures:
  - failure: Memory hoarding
    symptom: Everything is stored; retrieval returns noise
    fix: Strict write gate; store facts and outcomes, not transcripts
  - failure: Stale facts
    symptom: Agent acts on information that changed months ago
    fix: Date every fact; prefer recent ones; ask when facts look old
  - failure: Inferred facts treated as stated
    symptom: Agent "remembers" things the user never said
    fix: Store only stated facts or verified outcomes, with a source
  - failure: No user control
    symptom: Users can't see or remove what's stored
    fix: Memory view, edit and delete; honor deletion everywhere

related:
  - { type: Combines with, pattern: context-compaction }
  - { type: Combines with, pattern: agentic-rag }
  - { type: Feeds, pattern: learning-loop }
  - { type: Combines with, pattern: habit-formation }
  - { type: Combines with, pattern: talker-reasoner }
---
