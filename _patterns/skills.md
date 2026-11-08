---
title: Skills / Progressive Disclosure
n: 24
family: runtime
maturity: emg
axes: [context]
intent: Packaged instructions load only when relevant, keeping base context small.
aka: agent skills, capability packs, on-demand instructions
status: full

problem: >-
  As an agent takes on more jobs, its system prompt grows with instructions for each one:
  how to build a spreadsheet, the house style for proposals, the steps for an expense
  report. Soon every request pays for thousands of tokens of instructions it doesn't use,
  and the relevant ones get lost among the rest.
forces:
  - Agents need detailed, task-specific know-how to do work well.
  - Context spent on unused instructions costs money and dilutes attention.
  - Teams want to add capabilities without editing one giant prompt.
  - The agent must notice when a skill applies, or it won't load it.

solution: >-
  Package each capability as a skill: a folder with a short name and one-line description,
  a main instruction file, and optional scripts, templates or reference files. Only the
  names and descriptions sit in the agent's base context. When a request matches a skill,
  the agent loads its instructions, then opens deeper files only if the task needs them.
  Skills are versioned and owned separately, so teams can add or improve one without
  touching the others.

diagram: skills
diagram_caption: "Three levels of disclosure: a one-line description is always loaded, the instructions load on match, and the detailed files load only when needed."

use_when:
  - The agent handles many distinct kinds of tasks
  - Each task type has detailed procedures, templates or scripts
  - Different teams own different capabilities
  - Base prompt size has become a cost or quality problem
avoid_when:
  - The agent does one narrow job; put the instructions in the prompt
  - Skills would be so small that the indirection isn't worth it
  - Requests rarely make clear which skill applies

tradeoffs:
  latency:     { score: 1, note: "One extra file read when a skill is used" }
  cost:        { score: 1, note: "Base context stays small on every request" }
  complexity:  { score: 2, note: "Folder convention, descriptions and versioning" }
  reliability: { score: 4, note: "Focused instructions; depends on good descriptions" }
gains:
  - Small base context no matter how many capabilities exist
  - Capabilities added or updated independently
  - Detailed know-how available exactly when it's needed
costs:
  - Weak descriptions mean skills don't get loaded when they should
  - Overlapping skills can conflict
  - Another artifact type to version, test and own

example:
  scenario: A company's internal assistant has 26 skills, from "quarterly business review deck" to "file an expense" to "security questionnaire".
  steps:
    - who: Base context
      what: "Holds 26 one-line descriptions, about 1,200 tokens in total, instead of roughly 60,000 tokens of full instructions."
    - who: User
      what: "“Draft answers for this vendor security questionnaire.”"
    - who: Agent
      what: "Matches the description for the security questionnaire skill and loads its instructions: a 2-page procedure with answer rules and approval steps."
    - who: Agent
      what: "Question 14 asks about encryption key rotation, so it opens the skill's reference file on key management. Other reference files stay closed."
    - who: Skill owner
      what: "The security team updates the skill after a policy change. Version 3 goes live for everyone the same day, with no change to the agent's prompt."

failures:
  - failure: Skill not triggered
    symptom: Agent improvises instead of using the right skill
    fix: Write descriptions in users' words; test triggering with sample requests
  - failure: Wrong skill triggered
    symptom: Similar skills confused
    fix: Distinct descriptions; merge overlapping skills
  - failure: Skill sprawl
    symptom: Hundreds of stale, unowned skills
    fix: Owners, usage metrics and retirement of unused skills
  - failure: Stale instructions
    symptom: Skill encodes an outdated policy or template
    fix: Review dates and owners; evals per skill

related:
  - { type: Provided by, pattern: agent-harness }
  - { type: Produced by, pattern: habit-formation }
  - { type: Combines with, pattern: context-compaction }
  - { type: Combines with, pattern: routing }
  - { type: Combines with, pattern: code-as-action }
---
