---
title: Project Memory File
n: 41
family: setup
maturity: est
axes: [context]
intent: A CLAUDE.md or AGENTS.md file holds conventions, commands and decisions that build up over time.
aka: CLAUDE.md, AGENTS.md, agent instructions file, repo memory
status: full

problem: >-
  Every new session with a coding agent starts from zero. The agent doesn't know how to run
  the tests, which libraries the team chose, which folders not to touch, or the mistake it
  made last week. Developers repeat the same instructions every session, and the agent still
  breaks conventions it was told about yesterday.
forces:
  - Each session starts without memory of earlier ones.
  - The same instructions get repeated across sessions and developers.
  - A file loaded into every session costs context, so it has to stay short.
  - Notes that nobody maintains become wrong and mislead the agent.

solution: >-
  Keep a memory file at the root of the repo, named `CLAUDE.md`, `AGENTS.md` or whatever your
  agent reads automatically. It holds what stays true across milestones: how to build, test
  and run the project; architecture in a few lines; conventions; folders and files the agent
  must not change; and decisions with a one-line reason. When the agent makes a mistake worth
  preventing, add a rule. Keep it short and specific, review changes to it like code, and
  link out to longer docs instead of pasting them in. Subfolders can have their own smaller
  memory files for local rules.

diagram: project-memory-file
diagram_caption: The memory file is loaded into every session. Lessons from each session flow back into it as short, reviewed rules.

use_when:
  - Any repo where coding agents work more than once
  - Several developers or agents work on the same codebase
  - The project has conventions or commands that aren't obvious
  - You keep correcting the agent on the same thing
avoid_when:
  - One-off scripts that won't be touched again
  - Using it as a dumping ground for long docs; link to them instead
  - Storing secrets or credentials, which never belong in it

tradeoffs:
  latency:     { score: 1, note: "Loaded automatically at session start" }
  cost:        { score: 1, note: "A few hundred to a few thousand tokens per session" }
  complexity:  { score: 1, note: "One Markdown file, reviewed like code" }
  reliability: { score: 4, note: "Fewer repeated mistakes; only as good as its upkeep" }
gains:
  - Every session starts with the team's conventions and commands
  - Mistakes get fixed once, as a rule, instead of every session
  - New developers benefit from the same file
costs:
  - Needs ongoing pruning so it stays short and true
  - Long files dilute the important rules
  - Conflicting rules confuse the agent

example:
  scenario: The Linkwatch repo after MVP1, with a CLAUDE.md the developer and agent maintain together.
  steps:
    - who: Commands
      what: "`make test` runs all tests in about 8 seconds. `make dev` starts the app. Always run `make test` before saying a task is done."
    - who: Architecture
      what: "3 lines: a checker worker, a SQLite store and a small web UI. Check results are append-only."
    - who: Decisions
      what: "SQLite, not Postgres, until there's more than one user (decided during MVP1). The check interval lives in config, never hard-coded."
    - who: Rules from mistakes
      what: "In MVP2 the agent edited a generated migration file. A rule is added: “Never edit files in /migrations; create a new migration.” It hasn't happened since."
    - who: Upkeep
      what: "Each milestone, the developer prunes the file. It stays at about 60 lines, and every change to it is part of a reviewed PR."

failures:
  - failure: Bloated file
    symptom: Hundreds of lines; the agent misses the important rules
    fix: Keep only what applies broadly; link to detailed docs
  - failure: Stale rules
    symptom: File describes commands or structure that changed
    fix: Update it in the same PR as the change; prune every milestone
  - failure: Vague rules
    symptom: "\"Write clean code\" changes nothing"
    fix: Write specific, checkable rules with the command or path
  - failure: Secrets in memory
    symptom: API keys or passwords committed in the file
    fix: Never; point to the secrets manager instead

related:
  - { type: Combines with, pattern: spec-driven-development }
  - { type: Specializes, pattern: tiered-memory }
  - { type: Combines with, pattern: agent-ready-repo }
  - { type: Analog of, pattern: skills }
  - { type: Combines with, pattern: artifact-ownership }
---
