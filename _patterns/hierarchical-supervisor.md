---
title: Hierarchical Supervisor
n: 10
family: multi
maturity: est
axes: [coordination]
intent: Managers over leads over specialists, mirroring an org chart.
aka: supervisor tree, multi-level orchestration, agent org chart
status: full

problem: >-
  A single orchestrator breaks down once a task spans many domains. It needs to understand
  every specialist's tools and output, its context fills with their details, and it can't
  review dozens of results well. Large jobs need delegation to happen at more than one
  level.
forces:
  - Each manager can only coordinate a handful of agents well.
  - Domain leads understand their specialists better than a top-level manager does.
  - Every extra level adds latency and a chance to lose information.
  - Responsibility must stay clear when something goes wrong.

solution: >-
  Arrange agents in a tree. A top supervisor owns the overall goal and talks only to a few
  domain leads. Each lead owns one area, breaks its part into tasks for its specialists,
  checks their output and reports a summary upward. Specialists do narrow work with narrow
  tools. Information flows down as goals and constraints and up as summaries and
  exceptions. Each level checks the work of the level below before passing it on.

diagram: hierarchical-supervisor
diagram_caption: Each supervisor talks to 2–5 agents at most. Summaries flow up and exceptions escalate; raw specialist output stays at its own level.

use_when:
  - The task spans several distinct domains, each with its own tools and checks
  - One orchestrator would need to manage more than about 5–7 agents
  - Different teams own different domains and their agents
  - You need clear accountability for each part of the result
avoid_when:
  - A flat Orchestrator–Workers setup handles the task fine
  - Latency matters; each level adds a round trip
  - Domains are so intertwined that leads would constantly need each other

tradeoffs:
  latency:     { score: 4, note: "Round trips at every level of the tree" }
  cost:        { score: 5, note: "Many agents plus review at each level" }
  complexity:  { score: 5, note: "Tree structure, contracts between levels, escalation" }
  reliability: { score: 4, note: "Local review catches errors before they climb" }
gains:
  - Scales to tasks no single orchestrator could manage
  - Each lead's context stays focused on its own domain
  - Clear ownership, which matters for audits and debugging
costs:
  - Highest cost and latency of the multi-agent patterns
  - Information loss through each summary step
  - Rigid; cross-domain issues have to travel up and back down

example:
  scenario: An enterprise agent prepares a response to a 60-question security and compliance questionnaire from a prospective customer.
  steps:
    - who: Supervisor
      what: "Splits the questionnaire into three areas and assigns each to a lead: Security, Privacy and Legal, and Infrastructure."
    - who: Security lead
      what: "Gives 24 questions to 3 specialists covering encryption, identity and incident response. It reviews their answers against the current policy documents."
    - who: Privacy lead
      what: "Finds that one question about data residency in a new region conflicts with what the Infrastructure lead reported. It escalates the conflict to the Supervisor instead of guessing."
    - who: Supervisor
      what: "Asks the Infrastructure lead to confirm. The region launched last month, so the Privacy answer is updated."
    - who: Supervisor
      what: "Assembles the final response with all 60 answers, flags 4 for human sign-off, and lists which lead owns each section."

failures:
  - failure: Telephone game
    symptom: Key detail lost as summaries move up the tree
    fix: Pass structured results with links to source evidence, not just prose
  - failure: Cross-branch conflicts
    symptom: Two leads give contradictory answers
    fix: Leads escalate conflicts; the supervisor runs a consistency check
  - failure: Over-hierarchy
    symptom: Three levels where one or two would do
    fix: Add a level only when a supervisor exceeds its span of control
  - failure: Unclear ownership
    symptom: Errors bounce between levels with no owner
    fix: Every output carries the agent and lead that produced it

related:
  - { type: Scales up, pattern: orchestrator-workers }
  - { type: Alternative, pattern: handoff }
  - { type: Alternative, pattern: blackboard }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: context-isolation }
---
