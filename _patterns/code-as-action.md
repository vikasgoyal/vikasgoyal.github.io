---
title: Code-as-Action
n: 23
family: runtime
maturity: emg
axes: [tool]
intent: The agent writes code that chains many tool calls, instead of one JSON call per step.
aka: code actions, programmatic tool calling, code mode
status: full

problem: >-
  With classic tool calling, every call is a full model turn: call, wait, read the whole
  result, decide the next call. A task that touches 50 records means 50 round trips, and
  every intermediate result passes through the model's context, even when the model only
  needs a total or a filtered list at the end.
forces:
  - Loops, filters and joins are natural in code and awkward as a series of separate calls.
  - Every round trip adds latency and tokens.
  - Large intermediate results crowd the context.
  - Running model-written code is riskier than running a fixed tool call.

solution: >-
  Expose tools as functions in a code environment instead of only as JSON schemas. The
  model writes a short program that calls the tools, loops over results, filters and
  aggregates, and prints only what it needs to see. The program runs in a sandbox, and the
  output comes back as one result. The model reads the summary, not the raw data, and
  can write another program if needed. Tool permissions and budgets still apply to every
  call the code makes.

diagram: code-as-action
diagram_caption: One model turn replaces dozens of tool calls. Intermediate data stays in the sandbox, and only the printed result returns to the model.

use_when:
  - Tasks loop over many items or combine results from several tools
  - Intermediate data is large but the needed answer is small
  - Latency and token cost from many round trips are a problem
  - A sandbox is already available
avoid_when:
  - One or two tool calls do the job
  - You can't run model-written code safely
  - Every individual action needs separate human approval

tradeoffs:
  latency:     { score: 1, note: "One turn instead of dozens" }
  cost:        { score: 1, note: "Intermediate data never enters the context" }
  complexity:  { score: 3, note: "Sandbox, tool SDK and error handling for code" }
  reliability: { score: 4, note: "Exact loops and math; code bugs are the new risk" }
gains:
  - Far fewer model turns for bulk work
  - Exact computation instead of the model doing math in its head
  - Context stays small because raw results stay in the sandbox
costs:
  - Requires a secure sandbox for generated code
  - Code bugs can fail silently or partway through
  - Harder for reviewers to follow than a list of tool calls

example:
  scenario: A customer success agent is asked which enterprise accounts have more than 3 open P1 tickets and a renewal in the next 90 days.
  steps:
    - who: Classic tool calling
      what: "Would need 1 call to list 180 enterprise accounts, then 180 ticket lookups and 180 CRM lookups, with each result passing through the model."
    - who: Code-as-Action
      what: "The model writes a 12-line program that lists the accounts, fetches tickets and renewal dates in batches, filters, sorts by renewal date, and prints a 5-row table."
    - who: Sandbox
      what: "Runs the program. The ticket and CRM tools are read-only within the agent's permissions. It makes 361 calls in total, all inside the sandbox."
    - who: Model
      what: "Sees only the 5-row result, about 200 tokens, and drafts a risk summary for each account."
    - who: Comparison
      what: "1 model turn instead of about 360, and the context grew by a table instead of thousands of ticket records."

failures:
  - failure: Unsafe code
    symptom: Generated code touches files or networks it shouldn't
    fix: Run in a sandbox with tool-level permissions and no ambient credentials
  - failure: Silent partial failure
    symptom: Some API calls fail but the program prints a clean-looking result
    fix: Require the program to report errors and counts alongside results
  - failure: Hidden actions
    symptom: Write actions buried in code bypass review
    fix: Keep write tools behind approval even when called from code
  - failure: Hard to audit
    symptom: Reviewers can't tell what the agent actually did
    fix: Log the program and every tool call it made

related:
  - { type: Evolves from, pattern: tool-use }
  - { type: Requires, pattern: sandboxed-execution }
  - { type: Combines with, pattern: bounded-autonomy }
  - { type: Combines with, pattern: context-isolation }
  - { type: Runs inside, pattern: agent-harness }
---
