---
title: Artifact Ownership
n: 43
family: setup
maturity: hor
axes: [decision, coordination]
intent: Each artifact is marked developer-owned, AI-drafted or joint, so everyone knows who decides what.
aka: ownership labels, human/AI artifact split, decision rights for AI artifacts
status: full

problem: >-
  When a coding agent can edit everything, it's unclear who decides what. The agent rewrites
  a spec the developer cared about, edits test expectations to make them pass, or changes a
  README section a teammate owns. Over time nobody knows which files reflect human decisions
  and which are the agent's best guess.
forces:
  - Some artifacts encode decisions only a person should make.
  - Agents are fast and useful at drafting almost everything.
  - Ownership that isn't written down is invisible to agents.
  - Too many locks slow the agent down and frustrate developers.

solution: >-
  Give every important artifact one of three ownership labels and write the mapping where the
  agent will see it, usually in the Project Memory File. Developer-owned artifacts, like the
  spec, acceptance tests and security config, can be changed by the agent only as a proposal
  the developer approves. AI-drafted artifacts, like implementation code, docs drafts and
  boilerplate, can be changed freely by the agent and are reviewed in PRs. Joint artifacts,
  like the memory file and architecture notes, are edited by both, with the agent explaining
  its edits. Enforce the most important labels with tooling, such as code owners or
  protected paths.

diagram: artifact-ownership
diagram_caption: Three lanes, three different rules. The labels are written where the agent reads them, and enforced in tooling for the files that matter most.

use_when:
  - Agents have broad write access to the repo
  - Some files encode business decisions, contracts or security choices
  - Several people and agents share the same codebase
  - Agents have changed tests or specs to make their work "pass"
avoid_when:
  - Solo throwaway projects where you review everything anyway
  - When the labels would cover every file; then nothing stands out
  - As a replacement for review; ownership complements PRs

tradeoffs:
  latency:     { score: 2, note: "Proposals on owned files wait for approval" }
  cost:        { score: 1, note: "A short mapping plus code-owner rules" }
  complexity:  { score: 2, note: "Labels, documentation, light enforcement" }
  reliability: { score: 4, note: "Human decisions can't be silently overwritten" }
gains:
  - Decisions stay with the people accountable for them
  - Agents can move fast on everything else
  - Tests and specs stay trustworthy as checks on agent work
costs:
  - Some friction when an owned file genuinely needs updating
  - Labels need upkeep as the repo changes
  - Gray areas need judgment, not just rules

example:
  scenario: The Linkwatch repo labels its artifacts in CLAUDE.md, with code-owner rules on the developer-owned ones.
  steps:
    - who: Developer-owned
      what: "`mvp-spec.md`, `tests/acceptance/` and `config/security.yml`. The agent may propose changes but not commit them."
    - who: AI-drafted
      what: "Everything in `src/`, unit tests and draft docs. The agent changes these freely, and they're reviewed in PRs."
    - who: Joint
      what: "`CLAUDE.md` and `docs/architecture.md`. Both edit them; the agent explains each change in its PR."
    - who: Moment of truth
      what: "In MVP2 an acceptance test fails after a change. Instead of editing the test, the agent opens a proposal: “the spec says alerts within 5 minutes; the new retry logic makes it 6. Change the spec or the retry?”"
    - who: Developer
      what: "Keeps the 5-minute requirement and asks for a shorter retry delay. The agent fixes the code, and the test stays as the developer wrote it."

failures:
  - failure: Agent edits the referee
    symptom: Tests or specs changed so the agent's work passes
    fix: Acceptance tests and specs developer-owned and protected
  - failure: Invisible labels
    symptom: Ownership known to people but never written down
    fix: Mapping in the memory file plus code-owner rules
  - failure: Everything locked
    symptom: Agent stalls on approvals for trivial edits
    fix: Keep developer-owned to the few files that encode decisions
  - failure: Joint means nobody
    symptom: Joint files drift with unexplained changes
    fix: Agent explains every edit to a joint file in its PR

related:
  - { type: Combines with, pattern: spec-driven-development }
  - { type: Combines with, pattern: project-memory-file }
  - { type: Combines with, pattern: pr-review-gate }
  - { type: Analog of, pattern: bounded-autonomy }
  - { type: Analog of, pattern: human-in-the-loop }
---
