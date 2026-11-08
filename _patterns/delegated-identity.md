---
title: Delegated Agent Identity
n: 29
family: runtime
maturity: hor
axes: [tool]
intent: Agents get their own scoped, auditable credentials to act for a user.
aka: agent identity, on-behalf-of access, agent credentials
status: full

problem: >-
  Agents often act with either a shared service account that can do far too much, or the
  user's own full credentials. With a service account, logs can't show which user an action
  was for, and one leaked key exposes everything. With user credentials, the agent can do
  anything the user can, and nobody can tell what the user did from what the agent did.
forces:
  - Agents need real access to act on users' behalf.
  - Security wants least privilege and short-lived credentials.
  - Audit needs to show both the agent and the user behind each action.
  - Users must be able to see and revoke what agents can do for them.

solution: >-
  Give each agent its own identity, registered like an application, and have it act through
  delegated, on-behalf-of tokens. A token names the agent, the user, the scopes granted (for
  example read calendar, draft but not send email) and a short expiry. Users grant scopes
  through a consent step and can revoke them. Every downstream system sees and logs both
  identities. High-risk scopes can require step-up approval each time instead of a
  standing grant.

diagram: delegated-identity
diagram_caption: Every action carries two names, the agent and the user it acts for, plus only the scopes that user granted, for a limited time.

use_when:
  - Agents act in systems on behalf of specific users
  - Audit must distinguish agent actions from human actions
  - Several agents need different, limited access
  - Users should control and revoke what agents can do
avoid_when:
  - The agent never touches user-specific data or systems
  - Target systems can't accept delegated tokens yet; use a gateway that maps them
  - A prototype with synthetic data only

tradeoffs:
  latency:     { score: 1, note: "Token checks are fast" }
  cost:        { score: 2, note: "Identity setup per agent and per system" }
  complexity:  { score: 4, note: "Registration, consent, scopes, token exchange, revocation" }
  reliability: { score: 5, note: "Least privilege and full attribution" }
gains:
  - Each action traceable to both the agent and the user
  - Least privilege, with short-lived, revocable access
  - Users stay in control of what agents can do for them
costs:
  - Identity plumbing across every target system
  - Older systems may not support delegated tokens
  - Consent prompts add friction if scopes are too granular

example:
  scenario: A scheduling agent books meetings for employees across calendars and email.
  steps:
    - who: Registration
      what: "IT registers \"Scheduling Agent\" as its own identity. It may request calendar read/write and email draft scopes, but never email send."
    - who: Consent
      what: "An employee grants the agent calendar access and draft email for 90 days. The grant appears in their account settings with a revoke button."
    - who: Action
      what: "The agent books a meeting with a token that names the Scheduling Agent acting for this employee, with the calendar write scope, expiring in 1 hour."
    - who: Calendar log
      what: "Shows “Created by Scheduling Agent on behalf of the employee”, not just the employee's name."
    - who: Incident
      what: "Months later, a bug makes the agent double-book meetings. Security finds every affected event with one query on the agent identity and revokes its write scope for all users within minutes."

failures:
  - failure: Shared super-account
    symptom: One agent key can access everything for everyone
    fix: Per-agent identity; per-user delegated tokens with narrow scopes
  - failure: Long-lived tokens
    symptom: Leaked token usable for months
    fix: Short expiry; refresh only within the granted consent
  - failure: Invisible delegation
    symptom: Logs show the user, not the agent
    fix: Both identities recorded in every downstream log
  - failure: Scope creep
    symptom: Agents gradually granted broad scopes "to make it work"
    fix: Periodic access reviews; step-up for sensitive scopes

related:
  - { type: Combines with, pattern: bounded-autonomy }
  - { type: Combines with, pattern: protocol-interop }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: ambient-agents }
  - { type: Provided by, pattern: agent-harness }
---
