---
title: Decision Records for Agents
n: 72
family: knowledge
maturity: est
axes: [context]
intent: Keep short decision records in the repo so agents know why the code is built the way it is.
aka: ADRs for agents, architecture decision records, why-files
status: full

problem: >-
  Agents can read code and explain what it does, but not why it was built that way. So they
  "improve" deliberate choices: swapping a database chosen for simplicity, removing a retry that
  guards a flaky vendor, undoing a shortcut taken for speed. The reasons live in old chats and in
  people's heads, and people move on.
forces:
  - Code shows what, not why.
  - The memory file must stay short.
  - Long design documents go stale and aren't read.
  - A decision that is never revisited becomes dogma.

solution: >-
  Record each significant decision as a short numbered file in `docs/decisions/`: title, date,
  status, context, the decision, its consequences, and the conditions that would change it, all
  in under a page. The memory file points to the folder and tells agents to read the relevant
  records before changing an area, and to cite record numbers in plans and pull requests. When
  an agent's plan conflicts with a record, it stops and asks, or proposes a new record that
  supersedes the old one. Accepted records are never edited, only superseded.

diagram: decision-records-for-agents
diagram_caption: Code tells the agent what the system does; decision records tell it which parts are deliberate.

use_when:
  - Codebases with deliberate, non-obvious choices
  - Agents doing larger changes or refactors
  - Teams with turnover or many contributors
  - After design spikes, to record what was chosen and why
avoid_when:
  - Trivial choices nobody would question
  - Local quirks better explained by a code comment
  - Teams that won't keep record status current

tradeoffs:
  latency:     { score: 1, note: "Read only when an area is changed" }
  cost:        { score: 1, note: "A page per decision" }
  complexity:  { score: 1, note: "A folder, a template and one rule in the memory file" }
  reliability: { score: 4, note: "Fewer agents undoing deliberate choices" }
gains:
  - Agents respect deliberate choices instead of undoing them
  - Decisions can be challenged on their stated conditions
  - New people and agents learn the why in minutes
costs:
  - Discipline to write a record when deciding
  - Superseded records pile up without an index
  - Records only help if agents are told to read them

example:
  scenario: The Linkwatch repo keeps decision records in `docs/decisions/`.
  steps:
    - who: Record 007
      what: "\"Use SQLite until we have more than one tenant.\" Revisit when: a second tenant signs, or the database exceeds 10 GB."
    - who: Agent plan
      what: "During a performance task the agent's first idea is moving to Postgres. Reading record 007, it flags the conflict and asks instead of proceeding."
    - who: Decision
      what: "The developer confirms there is still one tenant. The agent finds a missing index instead: 95th-percentile query time drops from 420 ms to 60 ms."
    - who: Later
      what: "The first multi-tenant customer signs. Record 012 supersedes 007, and the agent cites 012 in its migration plan."

failures:
  - failure: Records nobody reads
    symptom: Agents still undo recorded decisions
    fix: Point to records from the memory file; require citations in plans
  - failure: Edited history
    symptom: Old reasoning silently rewritten
    fix: Never edit accepted records; supersede them
  - failure: Essays
    symptom: Multi-page records nobody finishes
    fix: One page maximum, in a fixed template
  - failure: Dogma
    symptom: Decisions kept long after the reasons changed
    fix: Every record states the conditions that would change it

related:
  - { type: Combines with, pattern: project-memory-file }
  - { type: Combines with, pattern: spike-and-compare }
  - { type: Combines with, pattern: plan-then-code }
  - { type: Feeds, pattern: shared-knowledge-layer }
  - { type: Combines with, pattern: artifact-ownership }
---
