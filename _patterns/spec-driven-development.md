---
title: Spec-Driven Development
n: 40
family: setup
maturity: emg
axes: [context, decision]
intent: A short spec is the source of truth; the agent builds from it, not from chat history.
aka: spec-first development, mvp-spec, requirements file
status: full

problem: >-
  When building with a coding agent through chat, requirements end up scattered across
  dozens of messages. The agent works from whatever it remembers of the conversation, decisions
  get lost when the session ends, and a new session or a teammate can't tell what was
  actually agreed. The code drifts from what anyone intended.
forces:
  - Chat is a fast way to explore ideas but a poor record of decisions.
  - Agents follow written instructions far more reliably than implied ones.
  - Writing a full spec up front feels slow and gets stale.
  - Specs that are too vague let the agent fill gaps with its own guesses.

solution: >-
  Before the agent writes code, capture what's being built in a short spec file in the repo,
  such as `mvp-spec.md`. It covers the goal, users, in-scope and out-of-scope features,
  acceptance criteria, and constraints like stack, data and security. The developer owns the
  spec; the agent can draft it from an idea file, but a person approves it. Every build
  session starts by reading the spec, and changes of direction go into the spec first, then
  the code. The spec is scoped to one milestone and replaced by the next one, while lasting
  decisions move into the Project Memory File.

diagram: spec-driven-development
diagram_caption: Chat is for exploring; the spec is what gets built. Direction changes go into the spec first, so any session or teammate can pick up from it.

use_when:
  - Building anything bigger than a single small change
  - Work spans several sessions, agents or teammates
  - You need clear acceptance criteria to know when you're done
  - Stakeholders need to agree on scope before code is written
avoid_when:
  - Quick fixes and experiments where the spec would be longer than the change
  - Pure exploration where you don't yet know what you're building; prototype first
  - When the spec would just restate an existing ticket; link the ticket instead

tradeoffs:
  latency:     { score: 2, note: "An hour of spec work saves many hours of rework" }
  cost:        { score: 1, note: "Fewer wasted agent runs on the wrong thing" }
  complexity:  { score: 2, note: "One file per milestone, plus discipline to update it" }
  reliability: { score: 4, note: "Agent output checked against written acceptance criteria" }
gains:
  - The agent builds what was agreed, not what it inferred from chat
  - Any session or teammate can resume from the same source of truth
  - Acceptance criteria make "done" testable
costs:
  - Upfront time before the first line of code
  - Specs go stale if changes skip the spec
  - Over-detailed specs slow down learning and iteration

example:
  scenario: A developer builds "Linkwatch", a small app that monitors a list of URLs and alerts when one breaks.
  steps:
    - who: idea.md
      what: "The developer writes 6 lines: the problem, who it's for and the rough features."
    - who: Agent drafts spec
      what: "Turns the idea into `mvp-spec.md` for MVP1: add or remove URLs, an hourly check, an email alert on failure. Out of scope: login, dashboards, Slack. It lists 8 acceptance criteria."
    - who: Developer
      what: "Edits the spec by cutting email alerts to a log file for MVP1 and adding \"checks run under 30 seconds for 100 URLs\". Then approves it."
    - who: Build sessions
      what: "Each session starts with “read mvp-spec.md, then continue.” Halfway through, the developer decides to retry failed checks once. That's added to the spec first, then built."
    - who: Done check
      what: "The agent verifies all 8 acceptance criteria with tests. MVP1 ships. The spec is archived, and two lasting decisions (SQLite, check interval in config) move into CLAUDE.md."

failures:
  - failure: Spec bypassed
    symptom: Changes made in chat never reach the spec; code and spec disagree
    fix: Rule that direction changes update the spec first
  - failure: Vague acceptance criteria
    symptom: Agent declares done; the feature doesn't do what was meant
    fix: Write criteria as checks a test could verify
  - failure: Agent-owned spec
    symptom: Spec grows features nobody asked for
    fix: Agent drafts, developer edits and approves
  - failure: Spec as permanent document
    symptom: One giant spec mixes old milestones with current work
    fix: One spec per milestone; move lasting decisions to project memory

related:
  - { type: Combines with, pattern: project-memory-file }
  - { type: Feeds, pattern: plan-then-code }
  - { type: Combines with, pattern: thin-slice-mvps }
  - { type: Combines with, pattern: artifact-ownership }
  - { type: Analog of, pattern: plan-and-execute }
---
