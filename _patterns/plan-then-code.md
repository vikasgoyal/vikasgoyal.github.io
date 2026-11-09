---
title: Plan-then-Code
n: 44
family: buildloop
maturity: est
axes: [decision, verification]
intent: The agent proposes a plan; a human approves it before any files change.
aka: plan mode, design-first coding, plan review
status: full

problem: >-
  Given a task, a coding agent will often start editing files immediately. If it misread the
  task or picked a poor approach, you find out only after it has changed 20 files. Reviewing
  that diff is slow, and undoing a wrong direction costs more than the task itself.
forces:
  - Wrong approaches are cheapest to catch before any code exists.
  - Developers don't want to approve every small step.
  - Plans can look reasonable and still miss the hard part.
  - Agents explore the codebase better when they aren't also editing it.

solution: >-
  For any task beyond a trivial edit, have the agent work in a read-only planning step first.
  It explores the relevant code, then writes a short plan: the approach, files to change,
  new tests, risks and open questions. The developer reviews the plan, corrects the
  approach or answers the questions, and approves. Only then does the agent switch to
  editing, following the plan. If reality differs from the plan mid-task, the agent stops and
  updates the plan instead of improvising a different design.

diagram: plan-then-code
diagram_caption: Corrections are cheapest at the plan stage. A two-minute plan review often saves an hour of diff review and rework.

use_when:
  - Tasks touch several files or an unfamiliar part of the codebase
  - There's more than one reasonable approach
  - Mistakes would be expensive to unwind (schema, API, security changes)
  - You want to stay in control of design without writing the code
avoid_when:
  - One-line fixes and obvious changes
  - Pure exploration where you want the agent to try things quickly in a branch
  - When you'd approve without reading; then the plan is just overhead

tradeoffs:
  latency:     { score: 2, note: "A short planning and review step up front" }
  cost:        { score: 1, note: "Avoids expensive wrong-direction runs" }
  complexity:  { score: 1, note: "Most coding agents support a plan mode" }
  reliability: { score: 4, note: "Design mistakes caught before code exists" }
gains:
  - Wrong approaches caught before any code exists
  - The developer stays in charge of design decisions
  - The approved plan doubles as PR description and documentation
costs:
  - Adds a step to every non-trivial task
  - Plans can hide the hard part behind vague steps
  - Developers may rubber-stamp plans they didn't read

example:
  scenario: Linkwatch MVP2 adds Slack alerts alongside the existing log-file alerts.
  steps:
    - who: Agent (plan mode)
      what: "Reads the alert code and config, and changes nothing. Proposes: add a `SlackNotifier` class next to `LogNotifier`, a webhook URL in config, retries in the notifier, 4 new tests."
    - who: Open question
      what: "The plan asks: “Should a Slack failure block the log-file alert?”"
    - who: Developer
      what: "Answers no, the notifiers must be independent. Also says to put both behind a `Notifier` interface so email can be added in MVP3. Approves the revised plan."
    - who: Agent (editing)
      what: "Implements the plan: 6 files changed and 5 tests added, all passing."
    - who: Comparison
      what: "In a test without planning, the agent wired Slack directly into the checker loop. Undoing that took longer than the whole planned task."

failures:
  - failure: Vague plan
    symptom: "\"Update the alert logic\" with no files or approach"
    fix: Plan must list files, approach, tests and open questions
  - failure: Rubber-stamp approval
    symptom: Plans approved in seconds; problems surface in review
    fix: Keep plans short enough to actually read; review the risks section
  - failure: Plan drift
    symptom: Agent quietly does something different from the plan
    fix: Agent must stop and update the plan when reality differs
  - failure: Planning trivial tasks
    symptom: Plan reviews for one-line changes
    fix: Skip planning below a size or risk threshold

related:
  - { type: Analog of, pattern: plan-and-execute }
  - { type: Builds on, pattern: spec-driven-development }
  - { type: Combines with, pattern: test-first-loop }
  - { type: Analog of, pattern: human-in-the-loop }
  - { type: Combines with, pattern: pr-review-gate }
---
