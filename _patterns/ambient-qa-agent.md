---
title: Ambient QA Agent
n: 71
family: observe
maturity: hor
axes: [decision, verification]
intent: An always-on agent checks the running system against rules people wrote and opens a PR when one breaks.
aka: always-on QA, behaviour watchdog, continuous QA agent
status: full

problem: >-
  Tests run at merge time, on paths someone thought of. Behaviour drifts afterwards: a
  dependency changes, data grows, a feature flag flips, a third-party service changes its
  responses. Users find these problems first. Manual QA can't watch continuously, and alerts
  without a proposed fix just add toil.
forces:
  - Many failures appear only in the running system.
  - Alerts without fixes create work instead of removing it.
  - An agent that changes code unprompted is a risk.
  - Vague rules make the agent raise false alarms.

solution: >-
  Write a small set of behaviour rules in plain language, each with a check, such as "a redirect
  to a working page is never shown as broken." An ambient agent runs the checks on a schedule or
  on events, against staging and, read-only, against production. When a rule fails, it
  reproduces the problem, writes a failing test, and opens a pull request with a proposed fix,
  or an issue with evidence if it can't fix it. It never merges: its pull requests go through
  the same gates as anyone else's. People own the rules, which are versioned and protected.

diagram: ambient-qa-agent
diagram_caption: The agent watches continuously but acts only by proposing. Every fix still passes the normal review gate.

use_when:
  - User-visible behaviour that can be checked automatically
  - Systems that depend on outside services that change
  - A production feedback loop is already in place
  - Regressions reach users before tests catch them
avoid_when:
  - No staging environment or safe way to run checks
  - Behaviour that can't be written as checkable rules
  - Teams already overloaded with pull requests; fix review capacity first

tradeoffs:
  latency:     { score: 1, note: "Runs in the background on a schedule" }
  cost:        { score: 3, note: "Continuous checks plus agent runs on failures" }
  complexity:  { score: 3, note: "Rules, safe check environment, PR plumbing" }
  reliability: { score: 4, note: "Drift caught before users report it" }
gains:
  - Regressions found between releases, not by customers
  - Alerts arrive with a reproduction and a proposed fix
  - Rules document what the product must always do
costs:
  - Noisy rules erode trust quickly
  - Adds pull requests to the review queue
  - Needs a safe, read-only way to check production

example:
  scenario: The Linkwatch team runs an ambient QA agent with eight behaviour rules.
  steps:
    - who: Rules
      what: "Eight rules, including \"a 301 redirect to a working page counts as up\" and \"the dashboard loads in under 2 seconds with 10,000 links\"."
    - who: Schedule
      what: "Staging is checked every hour; production every 6 hours with read-only synthetic checks."
    - who: Detection
      what: "A CDN starts returning 308 redirects instead of 301. Rule 1 fails on staging on Tuesday morning."
    - who: Proposal
      what: "The agent reproduces it, writes the failing test `test_308_counts_as_up`, treats 307 and 308 like 301, and opens a pull request."
    - who: Gate
      what: "The pull request is reviewed and merged in 40 minutes, before any customer reports it. One rule that raised 3 false alarms that month is rewritten."

failures:
  - failure: Noisy rules
    symptom: False alarms get ignored, then real ones too
    fix: Tune or remove rules after repeated false alarms
  - failure: Self-merging
    symptom: Agent changes reach production without review
    fix: Agent only opens PRs; normal gates and protected rule files apply
  - failure: Checks with side effects
    symptom: Synthetic checks create real data or emails
    fix: Read-only synthetic checks in production
  - failure: PR flood
    symptom: Ambient PRs swamp human reviewers
    fix: Cap open ambient PRs at what reviewers can handle

related:
  - { type: Specializes, pattern: ambient-agents }
  - { type: Feeds, pattern: production-feedback-loop }
  - { type: Combines with, pattern: test-first-loop }
  - { type: Combines with, pattern: review-capacity-limits }
  - { type: Combines with, pattern: protected-rule-files }
---
