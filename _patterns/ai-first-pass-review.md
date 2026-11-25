---
title: AI First-Pass Review
n: 53
family: verify
maturity: emg
axes: [verification]
intent: An AI reviewer checks every change before a person does, so human review time goes to the parts that need judgment.
aka: AI code review, pre-review, review triage
status: full

problem: >-
  Coding agents produce changes faster than people can review them. Reviewers either fall
  behind, so changes wait in a queue, or they skim, so problems reach production. Much of
  their time goes on issues a machine could catch: missing tests, unhandled errors,
  inconsistent naming, a forgotten migration.
forces:
  - Human review is the scarce resource once agents write most of the code.
  - Many review findings are mechanical and repeat across changes.
  - An AI reviewer that flags everything trains people to ignore it.
  - Judgment about design, intent and risk still needs a person.

solution: >-
  Run an AI reviewer on every pull request as soon as it opens, after CI. It checks the
  change against the team's review checklist and the linked spec or ticket, and posts
  numbered findings with a severity and a line reference. It also writes a short risk
  summary for the human reviewer: what changed, which parts carry the most risk, and what to
  look at first. The author, human or agent, fixes the mechanical findings before a person
  reviews. The human reviewer starts from the risk summary and decides; the AI reviewer
  never approves or merges. Track which AI findings people accept or dismiss, and tune the
  checklist from that.

diagram: ai-first-pass-review
diagram_caption: The AI pass clears mechanical issues and points the human at the risky parts. Approval stays with a person.

use_when:
  - Review queues grow as agents open more pull requests
  - Reviewers spend much of their time on repeatable, mechanical issues
  - You have a written review checklist or can write one
  - Teams want faster review without lowering the bar
avoid_when:
  - Low change volume where human review keeps up easily
  - When it would replace human review instead of focusing it
  - Before CI exists; let tests catch what tests can catch first

tradeoffs:
  latency:     { score: 1, note: "Runs in minutes; shortens human review time" }
  cost:        { score: 2, note: "One model pass per pull request" }
  complexity:  { score: 2, note: "Checklist, CI integration, finding format" }
  reliability: { score: 4, note: "Catches mechanical issues consistently; humans keep judgment" }
gains:
  - Human reviewers spend their time on design and risk
  - Mechanical issues fixed before a person looks
  - Accepted and dismissed findings show what the team actually cares about
costs:
  - Noisy findings erode trust quickly
  - Risk of reviewers rubber-stamping what the AI passed
  - Another tool to tune and maintain

example:
  scenario: A 12-person payments team where agents now open more pull requests than reviewers can keep up with.
  steps:
    - who: Pull request
      what: "An agent opens a PR that adds partial refunds: 9 files and about 350 lines. CI passes."
    - who: AI reviewer
      what: "Posts 6 findings. High: the refund amount isn't checked against the original charge. Medium: no test for a currency with 3 decimal places. Four low: naming and docstrings."
    - who: Risk summary
      what: "“Riskiest part: `refunds/service.py` lines 40–88, where money moves. Ledger entries look correct. Check the rounding.”"
    - who: Agent
      what: "Fixes the high and medium findings and 3 of the low ones, and explains why it skipped the fourth. CI passes again."
    - who: Human reviewer
      what: "Starts from the risk summary, reviews the money-handling code closely and approves."
    - who: Monthly tuning
      what: "Reviewers dismissed most docstring findings, so that check is turned off. Missing-test findings were almost always accepted, so they're raised to medium."

failures:
  - failure: Noise
    symptom: Dozens of low-value findings; people stop reading them
    fix: Severity levels; tune the checklist from accept and dismiss rates
  - failure: Rubber-stamping
    symptom: Humans approve whatever the AI passed
    fix: The human reviews the risk summary's hot spots, not just the AI's verdict
  - failure: AI approves or merges
    symptom: Changes land with no human judgment
    fix: The AI reviewer can comment only; branch protection requires a human
  - failure: Same blind spots as the author
    symptom: AI reviewer misses what the coding agent got wrong
    fix: Use a different model or prompt for review than for writing code

related:
  - { type: Combines with, pattern: pr-review-gate }
  - { type: Combines with, pattern: small-change-budget }
  - { type: Combines with, pattern: review-capacity-limits }
  - { type: Analog of, pattern: cross-model-critique }
  - { type: Analog of, pattern: llm-as-judge }
---
