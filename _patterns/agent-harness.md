---
title: Agent Harness
n: 22
family: runtime
maturity: emg
axes: [tool, context, decision]
intent: A reusable runtime for loop, tools, memory, permissions and progress, instead of one-off scripts.
aka: agent runtime, harness as platform, agent operating layer
status: full

problem: >-
  Most teams build each agent from scratch: its own loop, tool wrappers, memory, permission
  checks and logging. The result is a dozen agents that each solve the same problems
  slightly differently, none of them well, and none of them governed in one place. The
  model is the same across all of them; the code around it is what varies and breaks.
forces:
  - Every agent needs the same plumbing (loop, tools, memory, policy, logs).
  - Teams want to ship specific agents quickly, not rebuild infrastructure.
  - Security and compliance want one place to set and audit the rules.
  - A shared platform can become a bottleneck if it's too rigid.

solution: >-
  Build the harness once and treat it as the platform. It runs the agent loop and owns the
  shared services: tool connections, context management and compaction, memory, skills,
  permission policy, sandboxes, budgets, progress tracking and logging. Agents,
  workflows and prompts become configuration that lives on the harness. Some of that
  configuration is provided centrally by the organization and some is built by teams or
  individual employees, all inside the same policy envelope. Improving the harness
  improves every agent at once.

diagram: agent-harness
diagram_caption: "The harness is the platform, and agents are configuration on top of it. Corporate and employee-built layers share the same services and the same rules."

use_when:
  - An organization plans more than a handful of agents
  - Governance, audit and security need one enforcement point
  - Employees should be able to build their own agents and workflows safely
  - Agents run long tasks that need progress tracking and recovery
avoid_when:
  - A single, narrow agent with no plans to add more
  - A prototype where speed matters more than reuse
  - The platform would be so rigid that teams route around it

tradeoffs:
  latency:     { score: 2, note: "Little overhead per step once built" }
  cost:        { score: 3, note: "Upfront platform investment; cheaper per agent after" }
  complexity:  { score: 4, note: "A real platform with owners, versions and roadmap" }
  reliability: { score: 4, note: "Shared, tested plumbing beats many one-off scripts" }
gains:
  - New agents become configuration, not new code
  - One place to enforce policy, audit and observe every agent
  - Improvements to memory, tools or safety reach all agents at once
costs:
  - Significant upfront investment and an owning team
  - Platform decisions constrain every agent built on it
  - Version changes in the harness need careful rollout

example:
  scenario: A company moves from 9 separately built agents to one internal harness.
  steps:
    - who: Before
      what: "9 agents across 5 teams, with 4 different tool wrappers, 3 memory approaches and no shared audit log. Security can't answer which agents can send external email."
    - who: Harness
      what: "Provides the agent loop, tool connections through a standard protocol, tiered memory, a policy engine, sandboxes, budgets and one trace store."
    - who: Corporate layer
      what: "IT publishes shared skills (\"book travel\", \"file expense\") and the policy: external email needs approval, and spending is capped per role."
    - who: Employee layer
      what: "A sales engineer builds a personal \"RFP first draft\" workflow from existing skills in an afternoon. It inherits every policy automatically."
    - who: After 6 months
      what: "34 agents and workflows run on the harness. Security answers the external-email question with one query, and a memory improvement shipped once reaches all 34."

failures:
  - failure: Platform too rigid
    symptom: Teams build shadow agents outside the harness
    fix: Extension points for custom tools and logic within the policy envelope
  - failure: Leaky abstraction
    symptom: Agent builders need to understand harness internals to debug
    fix: Good traces and docs; clear contracts for tools and skills
  - failure: Big-bang upgrades
    symptom: A harness update breaks many agents at once
    fix: Versioned releases, canary agents and eval suites per agent
  - failure: Ownership gap
    symptom: Nobody owns the harness roadmap; it stagnates
    fix: A platform team with a backlog driven by agent builders

related:
  - { type: Provides, pattern: bounded-autonomy }
  - { type: Provides, pattern: skills }
  - { type: Provides, pattern: context-compaction }
  - { type: Combines with, pattern: protocol-interop }
  - { type: Provides, pattern: sandboxed-execution }
---
