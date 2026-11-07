---
title: Routing
n: 6
family: core
maturity: est
axes: [decision]
intent: Classify the request and send it to the right prompt, model or agent.
aka: intent routing, dispatcher, triage, model router
status: full

problem: >-
  One general-purpose agent handling every kind of request ends up with a huge prompt, too
  many tools and the most expensive model on every call. Tuning it for billing questions
  makes it worse at technical ones, and simple requests pay the same price as hard ones.
forces:
  - Specialized prompts and tools beat one generalist on each category.
  - Most traffic is simple and doesn't need the strongest model.
  - A wrong route sends the request to a handler that can't help.
  - Every route is one more thing to build, test and monitor.

solution: >-
  Put a classifier at the front door. It reads the request and returns a route label with a
  confidence score; this can be a small fast model, an embedding match or plain rules. Each
  route leads to its own handler with a focused prompt, its own tools and the cheapest model
  that does the job well. Low-confidence or unknown requests go to a safe fallback, such as a
  general agent or a human queue, instead of being forced into the closest route.

diagram: routing
diagram_caption: The classifier only decides where a request goes. Low-confidence requests take the fallback route instead of the nearest guess.

use_when:
  - Requests fall into distinct categories with different needs
  - Some categories are simple enough for a deterministic workflow or small model
  - Separate teams own different domains and want separate prompts
  - Cost matters and most traffic is routine
avoid_when:
  - Categories overlap so much that the classifier can't separate them
  - There are only one or two kinds of request
  - A single request usually spans many categories; use Orchestrator–Workers

tradeoffs:
  latency:     { score: 1, note: "One fast classification call, then a lighter handler" }
  cost:        { score: 1, note: "Cheap handlers take most traffic" }
  complexity:  { score: 3, note: "Classifier, routes and fallback to maintain" }
  reliability: { score: 4, note: "Focused handlers beat one generalist" }
gains:
  - Each handler gets a small, focused prompt and tool set
  - Large savings by sending simple requests to cheap models or plain code
  - Teams can improve one route without touching the others
costs:
  - Misroutes are silent unless you measure them
  - Requests that mix categories need special handling
  - The route list needs upkeep as new request types appear

example:
  scenario: A SaaS company's support assistant receives about 6,000 messages a week.
  steps:
    - who: Customer
      what: "“I was charged twice this month.”"
    - who: Classifier
      what: "A small model returns `route: billing, confidence: 0.95`."
    - who: Billing workflow
      what: Looks up the invoices with code, confirms the duplicate charge, and starts the standard refund flow. No large model is involved.
    - who: Customer
      what: "“After the update, the SSO login loops and the audit export is empty.”"
    - who: Classifier
      what: "Returns `route: tech_support, confidence: 0.58`. That's below the 0.7 threshold, so it takes the fallback to a general agent with a reasoning model, which handles both issues."
    - who: Route log
      what: A weekly review of fallback cases shows that "SSO and integrations" questions keep landing there, so the team adds an identity route.

failures:
  - failure: Silent misroute
    symptom: Requests answered confidently by the wrong handler
    fix: Log route and confidence; sample and label routes weekly
  - failure: Forced fit
    symptom: New request types squeezed into the nearest route
    fix: Confidence threshold plus a fallback route
  - failure: Mixed requests
    symptom: Only the first of two issues gets handled
    fix: Detect multiple intents and route each, or escalate to a general agent
  - failure: Route sprawl
    symptom: Dozens of tiny routes nobody owns
    fix: Merge low-volume routes; give each route an owner and metrics

related:
  - { type: Specialized as, pattern: fast-slow-escalation }
  - { type: Combines with, pattern: prompt-chaining }
  - { type: Alternative, pattern: orchestrator-workers }
  - { type: Combines with, pattern: reflex-layer }
  - { type: Alternative, pattern: handoff }
---
