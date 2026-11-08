---
title: Generative UI
n: 28
family: runtime
maturity: hor
axes: [tool]
intent: The agent renders or changes interface elements, not just chat text.
aka: GenUI, chat-to-UI, agent-driven interface
status: full

problem: >-
  Chat is a poor format for many answers. A comparison belongs in a table, a trend in a chart,
  a booking in a form, a filter change on the dashboard itself. When the agent can only
  reply in text, users have to read paragraphs and then go do the work in a different screen.
forces:
  - Many answers are clearer as tables, charts, forms or changed views.
  - Users still want to ask in plain language.
  - Free-form generated interface code is risky and inconsistent.
  - The interface must stay usable when the agent gets something wrong.

solution: >-
  Let the agent respond by changing the interface instead of only writing text. The
  application exposes a catalog of components (table, chart, form, card, filter, map) and
  state actions (apply filter, open record, add row), each with a schema. The agent picks
  components and fills them with data, or emits state updates, through a structured
  protocol, and the app renders them with its own design system. The user's input can be
  chat while the output is the UI changing. Users can edit what the agent produced, and
  every change can be undone.

diagram: generative-ui
diagram_caption: The agent chooses and fills components; the app renders them. Users see a consistent, editable interface instead of free-form generated code.

use_when:
  - Answers are naturally tables, charts, forms or filtered views
  - Users work in an app and want the app itself to respond
  - The app has a component library that can be described with schemas
  - Actions should be reviewable in a form before they're submitted
avoid_when:
  - Short factual answers where text is clearest
  - The app has no stable component catalog to expose
  - Every UI change would need its own security review

tradeoffs:
  latency:     { score: 2, note: "Structured output plus rendering" }
  cost:        { score: 2, note: "Similar to text; schemas add some tokens" }
  complexity:  { score: 4, note: "Component catalog, protocol, state sync, undo" }
  reliability: { score: 3, note: "Consistent rendering; wrong component choices happen" }
gains:
  - Answers in the most useful form, not just paragraphs
  - Users can act directly on what the agent produced
  - Consistent look and accessibility, because the app renders everything
costs:
  - A component catalog and protocol to design and maintain
  - The agent may pick the wrong component or overfill the screen
  - Keeping agent state and UI state in sync is tricky

example:
  scenario: An executive strategy dashboard where leaders ask questions in a chat box next to the main view.
  steps:
    - who: Executive
      what: "Types: “Show me initiatives over budget in EMEA.”"
    - who: Agent
      what: "Doesn't reply with text. It emits `apply_filter(region=\"EMEA\", status=\"over_budget\")`, and the main table updates to 7 rows."
    - who: Executive
      what: "“Compare spend vs. plan for the top 3.”"
    - who: Agent
      what: "Emits a chart component with 3 initiatives, planned vs. actual spend, using the app's own chart style. It adds one sentence of text: “Data Platform is the largest gap at +$1.2M.”"
    - who: Executive
      what: "Clicks into the chart and drags Data Platform onto a watchlist. Clicks undo on an earlier filter. Every agent change is in the undo history."

failures:
  - failure: Wrong component
    symptom: Agent shows a chart where a number would do
    fix: Component descriptions say when to use each; evaluate choices
  - failure: Free-form UI code
    symptom: Inconsistent, inaccessible or unsafe generated markup
    fix: Only catalog components with schemas; the app renders them
  - failure: State drift
    symptom: Agent thinks a filter is applied that the user removed
    fix: Send current UI state to the agent with every request
  - failure: Irreversible UI actions
    symptom: Agent-submitted forms commit changes the user didn't review
    fix: Agent fills forms; the user submits, or Human-in-the-Loop gates it

related:
  - { type: Combines with, pattern: tool-use }
  - { type: Combines with, pattern: respond-then-refine }
  - { type: Combines with, pattern: protocol-interop }
  - { type: Combines with, pattern: human-in-the-loop }
  - { type: Combines with, pattern: talker-reasoner }
---
