---
title: Handoff
n: 11
family: multi
maturity: est
axes: [coordination]
intent: Agents pass control and context peer-to-peer with no central boss.
aka: swarm, agent transfer, baton passing
status: full

problem: >-
  In a conversation that moves between topics, one agent with every prompt and tool
  becomes bloated and confused, but routing only once at the start fails when the topic
  changes halfway through. A central orchestrator that relays every message adds latency and
  makes the conversation feel indirect.
forces:
  - Conversations change topic in ways no upfront router can predict.
  - Specialists work best with a small, focused prompt and tool set.
  - Every transfer risks losing context the user already gave.
  - Without a central controller, control can bounce back and forth.

solution: >-
  Give each specialist agent a handoff tool that names the agents it may transfer to. When
  a request falls outside its scope, the active agent calls the handoff with a short summary
  of what's known and what the user needs next. Control moves to the receiving agent, which
  now talks to the user directly with its own prompt and tools. The conversation history and
  the summary travel with it. There is no supervisor; each agent decides when to pass the
  baton.

diagram: handoff
diagram_caption: Only one agent is active at a time, and it talks to the user directly. Each handoff carries a summary so the user never repeats themselves.

use_when:
  - Customer conversations that move across domains (sales, billing, support)
  - Each domain has a clear owner with its own prompts and tools
  - You want the active specialist talking to the user directly
  - Topic changes happen mid-conversation, not just at the start
avoid_when:
  - Tasks need several agents working at once; use Orchestrator–Workers
  - You need one place that sees and controls the whole flow
  - Domains overlap so much that agents can't tell whose turn it is

tradeoffs:
  latency:     { score: 1, note: "No relay; the active agent answers directly" }
  cost:        { score: 2, note: "One agent active at a time" }
  complexity:  { score: 3, note: "Handoff rules, context transfer, loop prevention" }
  reliability: { score: 3, note: "Good with clear scopes; can ping-pong without them" }
gains:
  - Each agent stays small and focused
  - Natural conversation flow with no middle layer
  - Teams can own and ship their agent independently
costs:
  - No single place sees the whole conversation's logic
  - Context can be lost or distorted at each transfer
  - Agents may hand back and forth without resolving anything

example:
  scenario: A software company's customer assistant has three agents, Sales, Billing and Technical Support, each able to hand off to the other two.
  steps:
    - who: Customer → Sales
      what: "“We're thinking of upgrading to the Enterprise plan.” The Sales agent answers questions about features and seat counts."
    - who: Customer
      what: "“Before that, why was last month's invoice $1,200 higher?”"
    - who: Sales → Billing
      what: "Calls `handoff(to=\"billing\", summary=\"Acme, 120 seats, considering Enterprise; asking about Oct invoice +$1,200\")`."
    - who: Billing
      what: "Without asking the customer to repeat anything, finds 30 seats added mid-month with prorated charges. Explains the charge and offers to hand back to Sales."
    - who: Billing → Sales
      what: "Hands back with `summary=\"invoice explained, customer satisfied, resume Enterprise discussion\"`. Sales picks up the upgrade conversation where it left off."
    - who: Trace
      what: "The trace shows 2 handoffs and 0 repeated questions. Another session hit 4 handoffs in a row and was escalated to a human by the hop limit."

failures:
  - failure: Ping-pong
    symptom: Agents hand the user back and forth repeatedly
    fix: Hop limit per conversation; escalate to a human after it
  - failure: Lost context
    symptom: User asked to repeat information after a transfer
    fix: Require a structured summary on every handoff; pass full history
  - failure: Wrong recipient
    symptom: Agent hands off to the wrong specialist
    fix: Clear scope descriptions for each agent in the handoff tool
  - failure: Nobody owns the outcome
    symptom: Issues fall between agents
    fix: Log every transfer; review conversations with multiple handoffs

related:
  - { type: Alternative, pattern: routing }
  - { type: Alternative, pattern: orchestrator-workers }
  - { type: Alternative, pattern: hierarchical-supervisor }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: protocol-interop }
---
