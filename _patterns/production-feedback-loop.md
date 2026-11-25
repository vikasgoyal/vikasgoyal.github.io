---
title: Production Feedback Loop
n: 56
family: observe
maturity: emg
axes: [context, verification]
intent: Incidents, errors and telemetry flow back to coding agents as well-formed tasks, so production teaches the next change.
aka: ops-to-dev loop, telemetry-driven fixes, incident-to-PR
status: full

problem: >-
  Coding agents work from specs, code and tests, but they rarely see what happens after
  release. Errors pile up in dashboards, incidents get patched by hand, and the same kind of
  bug ships again because nothing connects production signals to the agents writing the next
  change. The faster agents ship, the more this gap costs.
forces:
  - Production is the only place some problems show up.
  - Raw telemetry is noisy; agents need focused, well-formed tasks.
  - Automatically acting on production signals carries risk.
  - People on call need fewer interruptions, not more.

solution: >-
  Connect production signals to the agents' task queue through a triage step. Error spikes,
  failed deploys, incident reviews and slow endpoints are grouped and deduplicated, then
  turned into tasks with the evidence attached: stack traces, the deploy that introduced the
  issue, affected users and a link to the dashboard. An agent picks up each task, reproduces
  it with a failing test, proposes a fix as a normal PR, and adds a regression test. Incident
  reviews also produce lasting lessons, which go into the project memory file or shared
  knowledge layer so the same mistake isn't repeated.

diagram: production-feedback-loop
diagram_caption: Production signals become ordinary tasks with evidence attached. Fixes still go through the same tests and review as any other change.

use_when:
  - Agents ship often and production issues need fast follow-up
  - Recurring bugs of the same kind keep reaching production
  - Telemetry and error tracking already exist
  - On-call engineers spend much of their time on repetitive fixes
avoid_when:
  - Systems without reliable error tracking or deploy history
  - Incidents that need human investigation across teams first
  - Letting agents change production directly; fixes still go through PRs

tradeoffs:
  latency:     { score: 1, note: "Fixes start minutes after a signal, not days" }
  cost:        { score: 2, note: "Triage plus agent runs on real issues" }
  complexity:  { score: 3, note: "Signal grouping, task format, integration with tracking" }
  reliability: { score: 4, note: "Regression tests and lessons prevent repeats" }
gains:
  - Production problems reach a fix far faster
  - Every fix arrives with a reproducing test
  - Lessons from incidents shape future agent changes
costs:
  - Noisy signals can flood the task queue
  - Needs good error tracking and deploy metadata
  - Risk of patching symptoms instead of causes

example:
  scenario: The payments team connects its error tracker and incident reviews to the agents' task queue.
  steps:
    - who: Signal
      what: "After a Tuesday deploy, `CurrencyMismatchError` appears 340 times in an hour, all from the refund endpoint."
    - who: Triage
      what: "Groups the errors, links them to the deploy that introduced them, and creates a task with the stack trace, 3 sample requests and the dashboard link."
    - who: Agent
      what: "Reproduces the issue with a failing test: refunds on invoices converted at a stale exchange rate. It opens a 40-line fix PR with the regression test."
    - who: Review
      what: "AI first-pass review and a human reviewer approve it within the hour. Errors drop to zero after the deploy."
    - who: Lesson
      what: "The incident review adds a rule to CLAUDE.md: “Read exchange rates through `RateService`, never from cached invoice data.” A similar bug in another endpoint is prevented a week later."

failures:
  - failure: Alert flood
    symptom: Hundreds of near-duplicate tasks from one problem
    fix: Group and deduplicate signals before creating tasks
  - failure: Symptom patching
    symptom: Agent suppresses errors instead of fixing the cause
    fix: Require a reproducing test; review checks the root cause
  - failure: Lessons lost
    symptom: The same class of bug returns months later
    fix: Incident reviews must produce a memory or knowledge-layer update
  - failure: Unsafe automation
    symptom: Fixes deployed without review in a rush
    fix: Same PR and review path; fast lane, not no lane

related:
  - { type: Combines with, pattern: test-first-loop }
  - { type: Feeds, pattern: shared-knowledge-layer }
  - { type: Analog of, pattern: ambient-agents }
  - { type: Combines with, pattern: review-capacity-limits }
  - { type: Analog of, pattern: learning-loop }
---
