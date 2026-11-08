---
title: Human-in-the-Loop
n: 18
family: safety
maturity: est
axes: [verification, decision]
intent: Pause for human approval before risky or irreversible actions.
aka: approval gate, human checkpoint, HITL
status: full

problem: >-
  Agents now send emails, change records, move money and deploy code. Most of those actions
  are routine, but some can't be undone or carry real business risk. Letting the agent do
  everything unsupervised is unsafe; making a person approve every step makes the agent
  pointless.
forces:
  - Some actions are irreversible or expensive to undo.
  - Every approval request costs a person's time and attention.
  - Reviewers who see too many requests start approving without reading.
  - The agent may wait hours for an approval, so its state must survive the pause.

solution: >-
  Classify every action the agent can take by risk: reversibility, money, data exposure and
  who is affected. Low-risk actions run automatically. High-risk actions pause the run and
  send the reviewer a short approval card: what the agent wants to do, why, the exact
  change, and what happens if it's rejected. The agent's state is saved so it can resume
  hours later. Approve, edit and reject are all first-class outcomes, and every decision is
  logged with who made it.

diagram: human-in-the-loop
diagram_caption: Risk is decided by policy, not by the agent's own judgment. Only the actions that need a human ever reach one.

use_when:
  - The agent takes irreversible actions (payments, deletions, external messages)
  - Regulations or contracts require a named person to approve
  - You're rolling out a new agent and building trust in it
  - Errors are rare but very costly
avoid_when:
  - Every action is easily reversible; log and allow undo instead
  - Volume is so high that reviewers would rubber-stamp
  - Decisions must happen faster than a person can respond

tradeoffs:
  latency:     { score: 4, note: "Gated actions wait minutes to hours for a person" }
  cost:        { score: 3, note: "Human review time is the main cost" }
  complexity:  { score: 3, note: "Risk policy, approval UI, pause and resume" }
  reliability: { score: 5, note: "A person signs off on every high-risk action" }
gains:
  - Prevents costly irreversible mistakes
  - Meets audit and compliance requirements with a clear record
  - Lets organizations adopt agents before trusting them fully
costs:
  - Slows high-risk work down to human speed
  - Approval fatigue erodes the value of review
  - Pause-and-resume state is real engineering work

example:
  scenario: A procurement agent handles purchase requests for an operations team.
  steps:
    - who: Agent
      what: "Processes 42 requests in a week. 37 are under $1,000 from approved vendors, so the policy lets them run automatically."
    - who: Policy
      what: "A $14,500 request for a new vendor trips two rules: amount over $5,000 and an unapproved vendor. The run pauses."
    - who: Approval card
      what: "Sent to the operations manager: “Buy 3 GPU workstations from NovaTech for $14,500. Reason: ticket OPS-311. NovaTech is not an approved vendor. If rejected, I'll request quotes from the 2 approved vendors instead.”"
    - who: Manager
      what: "Edits the request to 2 workstations and approves. The agent resumes the next morning with the edited quantity."
    - who: Audit log
      what: "Records the original request, the edit, the approver and the timestamp. Monthly review shows 5 approvals in total, with a median response time of 3 hours."

failures:
  - failure: Rubber-stamping
    symptom: Approvals take seconds and are almost never rejected
    fix: Gate fewer actions; show only the key facts; sample-audit approvals
  - failure: Vague approval requests
    symptom: Reviewer can't tell what will actually change
    fix: Show the exact action, amounts and recipients, plus the alternative
  - failure: Lost state on resume
    symptom: Agent restarts the task or acts on stale data after approval
    fix: Save state at the pause; re-check key facts before executing
  - failure: Agent decides its own risk
    symptom: Risky action classified as routine by the model
    fix: Risk tiers set by policy and code, not by the agent

related:
  - { type: Combines with, pattern: bounded-autonomy }
  - { type: Combines with, pattern: guardrails }
  - { type: Combines with, pattern: plan-and-execute }
  - { type: Combines with, pattern: delegated-identity }
  - { type: Combines with, pattern: metacognitive-monitor }
---
