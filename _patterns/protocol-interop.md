---
title: Protocol Interop (MCP / A2A)
n: 25
family: runtime
maturity: emg
axes: [tool, coordination]
intent: Standard servers for tools and agent-to-agent messaging across vendors.
aka: MCP servers, agent-to-agent protocol, standard agent integrations
status: full

problem: >-
  Every agent framework used to need its own custom connector for every tool and data
  source, and agents from different vendors couldn't work together at all. Ten agents and
  twenty systems meant up to two hundred one-off integrations, each with its own auth,
  error handling and upkeep.
forces:
  - Organizations use agents and tools from many vendors.
  - Custom connectors multiply as agents and systems are added.
  - Standard interfaces only help if both sides adopt them.
  - Opening systems to agents widens the security surface.

solution: >-
  Put standard protocols between the parts. For agent-to-tool access, expose each system once
  as a server using a common protocol such as the Model Context Protocol (MCP), describing
  its tools, resources and prompts in a standard way. Any compatible agent can then use it.
  For agent-to-agent work, use an agent-to-agent protocol such as A2A, where agents publish
  what they can do and exchange tasks and results. Put auth, rate limits and audit at these
  protocol boundaries, through a gateway where possible, so every connection follows the
  same rules.

diagram: protocol-interop
diagram_caption: "Integrations go from many-to-many to many-to-one: each system is exposed once, and each agent speaks one protocol."

use_when:
  - Several agents need the same systems
  - Agents from different vendors or teams must work together
  - You want to swap models or frameworks without rewriting integrations
  - Security wants a single choke point for agent access
avoid_when:
  - One agent and one or two systems; a direct integration is simpler
  - The system's API is too sensitive to expose broadly, even behind policy
  - The protocol's maturity doesn't yet meet your compliance requirements

tradeoffs:
  latency:     { score: 2, note: "A protocol hop per call; usually small" }
  cost:        { score: 2, note: "Build each server once; reuse everywhere" }
  complexity:  { score: 3, note: "Servers, gateway, auth and version management" }
  reliability: { score: 3, note: "Shared, tested connectors; protocols still evolving" }
gains:
  - Each system is integrated once, then reused by every agent
  - Agents, models and frameworks can be swapped independently
  - One place to enforce auth, rate limits and audit
costs:
  - Protocols and their security practices are still maturing
  - Every exposed server is a new attack surface
  - Tool descriptions from third-party servers can't be fully trusted

example:
  scenario: An enterprise with 6 agents from 3 vendors and 8 internal systems.
  steps:
    - who: Before
      what: "Each agent had custom connectors, adding up to 31 integrations, with 4 different approaches to CRM auth alone."
    - who: Tool servers
      what: "The platform team exposes each of the 8 systems once as an MCP server: CRM, ticketing, the HR system, document storage and others."
    - who: Gateway
      what: "All agent traffic to those servers goes through one gateway that checks the user's identity, applies per-agent tool allowlists and logs every call."
    - who: Agent to agent
      what: "A vendor's sales agent asks the internal pricing agent for a quote over an agent-to-agent protocol. The pricing agent returns a structured quote without exposing its own tools."
    - who: After
      what: "8 servers and 1 gateway replace 31 custom connectors. Adding a 7th agent takes a configuration change instead of new integrations."

failures:
  - failure: Malicious or poisoned tool descriptions
    symptom: Third-party server's tool text steers the agent
    fix: Allowlist servers; review descriptions; treat server output as untrusted
  - failure: Over-exposed servers
    symptom: Server offers write tools every agent can reach
    fix: Per-agent allowlists and scopes enforced at the gateway
  - failure: Version drift
    symptom: Server update breaks agents that relied on old behavior
    fix: Version servers; test agents against new versions before rollout
  - failure: Auth shortcuts
    symptom: Shared service accounts instead of user-level access
    fix: Pass user identity through; see Delegated Agent Identity

related:
  - { type: Standardizes, pattern: tool-use }
  - { type: Combines with, pattern: delegated-identity }
  - { type: Combines with, pattern: bounded-autonomy }
  - { type: Used by, pattern: agent-harness }
  - { type: Enables, pattern: handoff }
---
