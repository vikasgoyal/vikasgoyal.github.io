---
title: Tool Use
n: 1
family: core
maturity: est
axes: [tool]
intent: The model calls external functions or APIs through structured schemas, grounding it in real data and actions.
aka: function calling, tool calling, actions
status: full

problem: >-
  A language model only knows what was in its training data and its prompt. It can't
  check today's order status, query a database or send an email. Asked anyway, it either
  refuses or invents a plausible answer.
forces:
  - Real tasks need live data and side effects the model cannot produce on its own.
  - Free-text output is hard for code to parse reliably.
  - Every tool you expose widens what can go wrong, from wrong arguments to unwanted actions.
  - Too many tools in the prompt make the model pick the wrong one more often.

solution: >-
  Describe each tool to the model as a name, a one-line purpose and a JSON schema for its
  arguments. The model replies either with an answer or with a structured tool call. The
  runtime, not the model, validates the arguments against the schema, checks permissions,
  executes the call and returns the result to the model as a new message. The model then
  decides whether it needs another call or can answer.

diagram: tool-use
diagram_caption: The model only proposes calls. The runtime validates and executes them, which is where permissions and logging live.

use_when:
  - The answer depends on live or private data (orders, tickets, inventory)
  - The task needs an action in another system (create, update, send)
  - Exact computation matters, such as math, dates or currency
  - Downstream code needs structured output it can trust
avoid_when:
  - The model already has everything it needs in the prompt
  - The tool would take an irreversible action with no approval step
  - You'd be exposing dozens of tools at once; group them or route first

tradeoffs:
  latency:     { score: 2, note: "One extra model turn per tool call" }
  cost:        { score: 2, note: "Tool schemas add prompt tokens on every call" }
  complexity:  { score: 2, note: "Schemas, validation and error handling" }
  reliability: { score: 4, note: "Grounded answers instead of guesses" }
gains:
  - Answers grounded in real, current data
  - Structured outputs that downstream code can parse
  - A natural place to enforce permissions and audit every action
costs:
  - Tool descriptions need the same care as prompts
  - Each tool is a new failure surface (timeouts, bad arguments, rate limits)
  - Write actions need extra controls, such as approval steps and idempotency

example:
  scenario: An internal IT helpdesk agent with three tools, get_device(user), reset_mfa(user) and open_ticket(summary, priority).
  steps:
    - who: Employee
      what: "“My authenticator app stopped working after I got a new phone.”"
    - who: Model
      what: "Calls `get_device(user=\"a.shah\")` to check enrollment before acting."
    - who: Runtime
      what: "Validates the call against the schema, runs it, returns `{mfa_device: \"iPhone 12\", enrolled: 2024-03-02}`."
    - who: Model
      what: "Sees the device mismatch and calls `reset_mfa(user=\"a.shah\")`. The runtime's policy marks reset_mfa as sensitive and asks the employee to confirm first."
    - who: Model
      what: Explains how to re-enroll on the new phone. No ticket is needed.
    - who: Audit log
      what: Records both calls with arguments and results. A review shows reset_mfa is the most-called write tool, which justifies its confirmation step.

failures:
  - failure: Hallucinated arguments
    symptom: Model invents an ID or email that looks valid
    fix: Validate against the schema and look up IDs before writes
  - failure: Wrong tool chosen
    symptom: Similar tools get confused, e.g. search_orders vs get_order
    fix: Write distinct one-line descriptions; merge or route when tools overlap
  - failure: Unhandled tool errors
    symptom: Timeouts or 500s make the agent loop or give up silently
    fix: Return errors to the model as readable messages with a retry limit
  - failure: Unsafe side effects
    symptom: A write runs twice or without consent
    fix: Idempotency keys and confirmation for sensitive tools

related:
  - { type: Next step, pattern: react }
  - { type: Scales into, pattern: code-as-action }
  - { type: Combines with, pattern: bounded-autonomy }
  - { type: Standardized by, pattern: protocol-interop }
  - { type: Combines with, pattern: guardrails }
---
