---
title: Ambient Agents
n: 27
family: runtime
maturity: hor
axes: [decision, context]
intent: Always-on agents watch event streams and act or alert without a prompt.
aka: always-on agents, proactive agents, background agents, event-driven agents
status: full

problem: >-
  Chat agents only work when someone asks. But much valuable work is noticing: a customer
  email that signals churn risk, a build that keeps failing, a contract renewal approaching,
  a commitment someone made in a meeting. People miss these because nobody is watching
  everything all the time.
forces:
  - Valuable signals arrive continuously across many systems.
  - Most events are noise and need no action.
  - Interrupting people too often destroys trust quickly.
  - Acting without a request needs stronger permission rules than chat.

solution: >-
  Run the agent as a long-lived service subscribed to event streams such as email, calendar,
  tickets, code repos and CRM changes, plus scheduled triggers. Cheap reflexes filter each
  event for relevance. Relevant events update the agent's memory and a ledger of goals and
  commitments. The agent then picks the right response by policy: do nothing, take a small
  allowed action, add an item to a daily digest, or interrupt with an alert. Every
  proactive action is explainable ("I did this because…"), and users tune what the agent
  watches and how often it speaks up.

diagram: ambient-agents
diagram_caption: Most events are filtered out or batched into a digest. Interrupting someone is the rarest outcome, reserved for things that can't wait.

use_when:
  - Important signals are spread across many systems and arrive continuously
  - Missing a signal is costly (churn, outages, deadlines)
  - Users would welcome a daily digest of what changed
  - You have strong permission and audit controls in place
avoid_when:
  - Users can't easily control or silence the agent
  - The agent would need broad write access to be useful
  - Signals are rare enough that a scheduled report works fine

tradeoffs:
  latency:     { score: 1, note: "Reacts to events as they arrive" }
  cost:        { score: 3, note: "Always running; filtering keeps it manageable" }
  complexity:  { score: 5, note: "Event ingestion, memory, ledgers, policy, tuning" }
  reliability: { score: 3, note: "High value when tuned; noisy when not" }
gains:
  - Catches signals nobody would have noticed in time
  - Turns scattered events into one digest of what matters
  - Follow-ups and commitments stop falling through the cracks
costs:
  - Notification fatigue if thresholds are wrong
  - Broad read access raises privacy and security stakes
  - Hard to evaluate, because the value is in what didn't get missed

example:
  scenario: An always-on assistant for an account manager watches email, calendar, CRM and the support queue.
  steps:
    - who: Event stream
      what: "Receives about 600 events on a typical day."
    - who: Reflex filter
      what: "Drops 520 as noise: newsletters, automated notifications and routine status changes."
    - who: Memory + ledger
      what: "Updates account notes from the remaining 80. Records a commitment from a meeting transcript: “send the pricing proposal to Acme by Friday.”"
    - who: Digest
      what: "Wednesday 8am digest: 2 new P1 tickets at Contoso, Fabrikam's renewal in 30 days with usage down 22%, and the Acme proposal due in 2 days."
    - who: Alert
      what: "Thursday 3pm interruption, the only one that week: “Acme proposal due tomorrow and not started. Want a first draft from last quarter's version?”"

failures:
  - failure: Notification fatigue
    symptom: Users mute the agent within a week
    fix: Digest by default; interrupt only for time-critical items; user-tunable
  - failure: Creepy behavior
    symptom: Agent surfaces personal or sensitive things unprompted
    fix: Clear scopes on what's watched; explain why each item surfaced
  - failure: Unsupervised actions
    symptom: Agent acts on events in ways the user didn't expect
    fix: Bounded Autonomy plus approval for anything external
  - failure: Stale ledger
    symptom: Reminds about commitments already done
    fix: Close items from completion events; ask when unsure

related:
  - { type: Combines with, pattern: reflex-layer }
  - { type: Combines with, pattern: tiered-memory }
  - { type: Combines with, pattern: bounded-autonomy }
  - { type: Combines with, pattern: delegated-identity }
  - { type: Combines with, pattern: blackboard }
---
