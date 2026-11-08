---
title: Budget-aware Planning
n: 26
family: runtime
maturity: emg
axes: [decision]
intent: Each stage gets a token, time or dollar budget and degrades gracefully.
aka: cost-aware agents, resource budgets, anytime planning
status: full

problem: >-
  Agents don't naturally know when to stop. A research task can keep searching, a coding
  task can keep retrying, and a multi-agent run can keep spawning workers, while cost and
  time grow with no clear limit. When a hard limit finally cuts the run off, the user often
  gets nothing at all.
forces:
  - More effort usually improves results, but with diminishing returns.
  - Users and finance teams need predictable cost and response times.
  - A run cut off at a hard limit wastes everything spent so far.
  - Some requests deserve far more effort than others.

solution: >-
  Give each run an explicit budget for tokens, wall-clock time, tool calls or dollars, set
  by request type and priority. The planner splits the budget across stages and makes it
  visible to the agent as it works, such as "40% used, 3 steps left". As the budget runs
  down, the agent shifts from exploring to finishing: it stops opening new branches,
  summarizes what it has, and marks gaps. At the limit it always returns its best partial
  result with a clear note on what's missing, never an empty failure.

diagram: budget-aware-planning
diagram_caption: The agent sees its remaining budget and changes behavior as it runs down. Running out produces a labeled partial answer, not a failure.

use_when:
  - Open-ended tasks like research, debugging or multi-agent runs
  - Cost or response time must be predictable
  - A partial answer is better than none
  - Different users or request types justify different spend
avoid_when:
  - Tasks with a fixed, small number of steps
  - Correctness demands completion regardless of cost
  - You can't measure spend per run

tradeoffs:
  latency:     { score: 2, note: "Bounded by design" }
  cost:        { score: 1, note: "Capped per run; no runaway spend" }
  complexity:  { score: 3, note: "Budget tracking, stage allocation, finishing mode" }
  reliability: { score: 3, note: "Always returns something; may be incomplete" }
gains:
  - Predictable cost and latency per run
  - No more empty failures from hard cutoffs
  - Spend matches the value of each request
costs:
  - Some answers will be partial by design
  - Budgets need tuning per task type
  - Agents may stop exploring just before a breakthrough

example:
  scenario: A market research agent serves a strategy team. Standard requests get $2 and 5 minutes; priority requests get $10 and 20 minutes.
  steps:
    - who: Planner
      what: "A standard request: \"competitor pricing for agent platforms\". It splits the $2 budget as 50% search, 30% reading and 20% synthesis."
    - who: Agent
      what: "After 6 of 9 planned vendors, it has used 75% of the budget. The agent sees this and switches to finishing mode."
    - who: Finishing mode
      what: "Stops opening new sources, uses one quick search each for the remaining 3 vendors, and starts writing."
    - who: Result
      what: "A comparison table with 6 vendors fully sourced and 3 marked \"public pricing not found in budget\". Cost was $1.94 and time was 4 minutes 40 seconds."
    - who: User
      what: "Re-runs the request as priority for the 3 missing vendors only. The agent reuses the earlier results and fills the gaps for $3.10."

failures:
  - failure: Invisible budget
    symptom: Agent runs at full speed until it's cut off mid-step
    fix: Show remaining budget to the agent at every step
  - failure: Empty failure at the limit
    symptom: User gets an error after paying for most of the work
    fix: Always return the best partial result with gaps labeled
  - failure: Budgets too tight
    symptom: Most answers partial; users lose trust
    fix: Tune per task type from logged spend and outcomes
  - failure: Uneven stage spend
    symptom: Exploration eats the whole budget; no synthesis
    fix: Reserve a fixed share for the final answer

related:
  - { type: Combines with, pattern: plan-and-execute }
  - { type: Combines with, pattern: adaptive-thinking }
  - { type: Combines with, pattern: orchestrator-workers }
  - { type: Provided by, pattern: agent-harness }
  - { type: Combines with, pattern: parallelization }
---
