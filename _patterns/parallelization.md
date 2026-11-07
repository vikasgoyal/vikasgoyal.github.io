---
title: Parallelization
n: 7
family: core
maturity: est
axes: [coordination]
intent: Run independent subtasks at once, or run one task several times and vote.
aka: fan-out / fan-in, sectioning, voting, self-consistency
status: full

problem: >-
  Some tasks have several independent parts, and running them one after another wastes
  time. Other tasks are judgment calls where a single model answer is unreliable. In both
  cases, one sequential call leaves speed or confidence on the table.
forces:
  - Independent parts don't need to wait for each other.
  - Several focused prompts often beat one prompt juggling many concerns.
  - Running N calls multiplies token cost even when it cuts wall-clock time.
  - Merging results needs clear rules, or the parts contradict each other.

solution: >-
  Fan out, then fan in. In sectioning, split the task into independent parts and run a
  focused call for each at the same time, such as one reviewer per concern. In voting, run
  the same task several times, with different prompts, models or temperatures, and compare
  the answers. An aggregator merges the sections or tallies the votes using explicit rules,
  for example "flag if any reviewer finds a high-severity issue" or "accept if at least 2
  of 3 agree".

diagram: parallelization
diagram_caption: "Two variants share one shape: sectioning gives each worker a different job; voting gives every worker the same job."

use_when:
  - The task splits into parts that don't depend on each other
  - Each part benefits from its own focused prompt
  - Wall-clock latency matters more than total tokens
  - A judgment call needs more confidence than one answer gives
avoid_when:
  - Steps depend on each other's output; use Prompt Chaining
  - The budget is tight and one call is good enough
  - There's no clear rule for merging or settling disagreements

tradeoffs:
  latency:     { score: 1, note: "Wall-clock time of the slowest worker, not the sum" }
  cost:        { score: 4, note: "N calls means roughly N× tokens" }
  complexity:  { score: 2, note: "Fan-out, timeouts and a merge rule" }
  reliability: { score: 4, note: "Focused workers and votes catch more" }
gains:
  - Faster results on multi-part tasks
  - Focused prompts catch issues a combined prompt misses
  - Voting turns one shaky answer into a measurable level of agreement
costs:
  - Token cost multiplies with every worker
  - The aggregator becomes a single point of failure
  - Rate limits and slow workers can hold up the whole batch

example:
  scenario: An engineering team uses an agent to pre-review pull requests before a human reviewer looks.
  steps:
    - who: Split
      what: A new PR changes 14 files. Three workers start at the same time with the same diff.
    - who: Worker A · Security
      what: "Flags a SQL query built with string concatenation in `orders/repo.py`. `severity: high`"
    - who: Worker B · Style
      what: Notes 3 naming issues and 1 missing docstring, all low severity.
    - who: Worker C · Tests
      what: Reports that the new refund path has no test. Medium severity.
    - who: Aggregator
      what: "Applies the rule \"any high blocks merge\". It posts one combined comment, high issue first, with the PR marked `changes requested`."
    - who: Voting variant
      what: "For the high finding only, two more security runs re-check the same code. 3 of 3 agree, so the flag stays. A finding that only 1 of 3 runs reproduces is downgraded to a note."

failures:
  - failure: Hidden dependencies
    symptom: Workers make conflicting assumptions about shared parts
    fix: Split only truly independent parts; give all workers shared context
  - failure: Contradictory merge
    symptom: Final output says two incompatible things
    fix: Write explicit merge rules; let a final step reconcile conflicts
  - failure: Correlated votes
    symptom: All runs make the same mistake, so agreement is meaningless
    fix: Vary prompts or models, not only temperature
  - failure: Straggler or rate-limit stalls
    symptom: One slow worker delays everything
    fix: Per-worker timeouts; merge with what returned and note the gap

related:
  - { type: Grows into, pattern: orchestrator-workers }
  - { type: Combines with, pattern: prompt-chaining }
  - { type: Alternative, pattern: debate }
  - { type: Combines with, pattern: llm-as-judge }
  - { type: Combines with, pattern: budget-aware-planning }
---
