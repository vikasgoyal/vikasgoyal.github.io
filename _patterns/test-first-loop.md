---
title: Test-First Agent Loop
n: 45
family: buildloop
maturity: est
axes: [verification]
intent: Tests define "done"; the agent iterates until they pass.
aka: TDD with agents, red-green agent loop, test-driven agent
status: full

problem: >-
  A coding agent's sense of "done" is whether the code looks right to it. Without an
  objective check, it declares success on code that doesn't run, misses edge cases, or
  quietly changes behavior elsewhere. The developer becomes the test suite, finding the
  bugs by hand.
forces:
  - Agents iterate quickly when they get a clear pass or fail signal.
  - Tests written after the code tend to confirm what the code already does.
  - An agent under pressure to pass may weaken the test instead of fixing the code.
  - Writing good tests first takes thought about what "correct" means.

solution: >-
  Start each change with tests that describe the desired behavior, written or approved by
  the developer, or drafted by the agent from the spec's acceptance criteria and then
  reviewed. Confirm they fail. Then let the agent loop: change code, run the tests, read the
  failures, fix, repeat, until they pass. The full existing suite runs too, so nothing else
  breaks. The agent may not change the new tests or acceptance tests without approval; if it
  believes a test is wrong, it says so instead of editing it.

diagram: test-first-loop
diagram_caption: Tests are fixed before the loop starts. The agent can iterate as many times as it needs, but it can't move the finish line.

use_when:
  - Behavior can be expressed as automated tests
  - The agent can run the test suite quickly (see Agent-Ready Repo)
  - Bug fixes, where a failing test reproduces the bug first
  - Refactors, where existing tests must keep passing
avoid_when:
  - Visual or UX work that tests can't capture well; review manually
  - Exploratory prototypes where the behavior isn't known yet
  - When the test suite is too slow or flaky to run in a loop

tradeoffs:
  latency:     { score: 2, note: "Writing tests first, then fast loops" }
  cost:        { score: 2, note: "Several agent iterations, each cheap" }
  complexity:  { score: 2, note: "Test discipline and protected test files" }
  reliability: { score: 5, note: "Objective, repeatable definition of done" }
gains:
  - An objective "done" that doesn't depend on the agent's confidence
  - Regressions caught in the loop, not in production
  - Tests stay behind as documentation of intent
costs:
  - Time to write meaningful tests up front
  - Weak tests give false confidence
  - Agents may try to game tests unless they're protected

example:
  scenario: A bug report says Linkwatch marks a URL as broken when the site returns a redirect (HTTP 301).
  steps:
    - who: Developer + agent
      what: "The agent drafts a failing test: `test_redirect_counts_as_up` checks that a 301 to a working page is marked up. The developer approves it."
    - who: Red
      what: "The new test fails, confirming the bug. The other 64 tests pass."
    - who: Loop 1
      what: "The agent follows redirects. The new test passes, but `test_redirect_loop_marked_down` now hangs. The loop detects the timeout."
    - who: Loop 2
      what: "Adds a maximum of 5 redirects. All 66 tests pass in 9 seconds."
    - who: Guard
      what: "In an earlier attempt, the agent had proposed loosening the redirect-loop test. The rule in CLAUDE.md made it ask instead, and the developer said no."

failures:
  - failure: Test editing
    symptom: Agent weakens or deletes tests to get green
    fix: Protect new and acceptance tests; agent must ask to change them
  - failure: Tests that mirror the code
    symptom: Tests pass but don't check the requirement
    fix: Write tests from the spec's acceptance criteria, before code
  - failure: Endless loop
    symptom: Agent iterates for an hour without converging
    fix: Iteration cap; stop and report what's blocking
  - failure: Only new tests run
    symptom: New feature works; something else broke
    fix: Run the full fast suite in every loop

related:
  - { type: Analog of, pattern: evaluator-optimizer }
  - { type: Requires, pattern: agent-ready-repo }
  - { type: Combines with, pattern: plan-then-code }
  - { type: Combines with, pattern: artifact-ownership }
  - { type: Combines with, pattern: spec-driven-development }
---
