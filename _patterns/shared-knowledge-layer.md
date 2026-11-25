---
title: Shared Knowledge Layer
n: 58
family: knowledge
maturity: emg
axes: [context]
intent: An organization-wide store of decisions, conventions and lessons that every coding agent and engineer reads, with sources, ownership and access rules.
aka: engineering knowledge base for agents, org memory, decision registry
status: full

problem: >-
  A project memory file works for one repository, but most engineering knowledge spans many:
  architecture decisions, security rules, API conventions, lessons from incidents. Copied
  into each repo, it drifts out of date. Left in wikis and chat threads, agents never see it.
  Agents then re-make decisions the organization already settled, or treat an old opinion as
  current policy.
forces:
  - Knowledge spans many repositories and teams.
  - Agents need it in context, but only the relevant part.
  - Stale or unsourced knowledge is worse than none.
  - Some knowledge is restricted to certain teams.

solution: >-
  Keep a shared, versioned knowledge layer that agents can query, separate from any single
  repository. Each entry has an owner, a source (the decision record, incident review or PR
  it came from), a date, and a label saying whether it is a fact ("service X owns refunds") or
  an interpretation ("we prefer events over polling"). Access is scoped, so agents only see
  what their team may see. Agents retrieve only the entries relevant to the current task, and
  each repo's project memory file links to the layer instead of copying it. Entries past their
  review date are flagged, and contradictions go to the owner to resolve.

diagram: shared-knowledge-layer
diagram_caption: Each repo keeps a short memory file and draws the rest from one shared, sourced layer, filtered by task and by access.

use_when:
  - Many repositories share conventions and decisions
  - Agents keep re-deciding settled questions
  - Incident lessons need to reach every team
  - Some knowledge must stay within certain teams
avoid_when:
  - A single repository, where a project memory file is enough
  - No one is willing to own and review entries
  - Knowledge that changes daily; it belongs in live systems, not a store

tradeoffs:
  latency:     { score: 2, note: "A retrieval step before agent work" }
  cost:        { score: 2, note: "Storage, retrieval and ownership time" }
  complexity:  { score: 4, note: "Provenance, access scopes, review dates" }
  reliability: { score: 4, note: "Agents follow current, sourced decisions" }
gains:
  - One source of truth across repositories
  - Agents see why a rule exists, not just the rule
  - Incident lessons reach every team
costs:
  - Needs owners and a review cycle
  - Access rules add setup work
  - Poor retrieval floods context with irrelevant entries

example:
  scenario: An engineering group of 40 repositories where agents kept proposing direct database reads across service boundaries, against a decision made a year earlier.
  steps:
    - who: Seed
      what: "Architects add 60 entries from existing decision records, each with owner, source link, date and fact or interpretation label."
    - who: Link
      what: "Each repo's CLAUDE.md drops its copied rules and adds a pointer to the layer, plus repo-specific notes."
    - who: Agent
      what: "Asked to add a refund report, the agent retrieves 4 relevant entries, including the fact “Billing owns invoice data; read it through the Billing API” with its source decision."
    - who: Incident
      what: "A production feedback loop adds a new entry on exchange rate handling; within a day, agents in three other repos follow it."
    - who: Review
      what: "A quarterly check flags 7 entries past their review date. Owners retire 2 and update 5."

failures:
  - failure: Stale entries
    symptom: Agents follow a rule the org abandoned
    fix: Review dates; flag and expire unreviewed entries
  - failure: Opinion as fact
    symptom: One engineer's preference becomes policy
    fix: Label fact versus interpretation; show the source
  - failure: Context flood
    symptom: Dozens of entries loaded for a small change
    fix: Retrieve by task and repo; cap the entries per task
  - failure: Leaking restricted knowledge
    symptom: Agents see entries outside their team's scope
    fix: Enforce access scopes at retrieval, not in the prompt

related:
  - { type: Scales, pattern: project-memory-file }
  - { type: Fed by, pattern: production-feedback-loop }
  - { type: Analog of, pattern: tiered-memory }
  - { type: Combines with, pattern: agentic-rag }
  - { type: Combines with, pattern: artifact-ownership }
---
