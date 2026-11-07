---
title: Respond-then-Refine
n: 35
family: fastslow
maturity: hor
axes: [decision]
intent: An instant first answer from System 1, followed by a refined System 2 version.
aka: progressive answer, quick answer + deep follow-up, two-stage response
status: full

problem: >-
  Users want an answer now, but the best answer takes a reasoning model many seconds or
  minutes. Making them wait loses their attention; giving only the fast answer leaves
  quality on the table for the questions where depth matters.
forces:
  - Perceived speed matters as much as actual speed.
  - A quick answer is often good enough, and the user moves on.
  - Changing an answer after the user has read it can confuse or erode trust.
  - Running the slow model on every request is wasteful if users rarely need it.

solution: >-
  Return a fast model's answer immediately, clearly labeled as a first take. Start the
  reasoning model in the background on the same request, with the fast answer as context.
  When it finishes, show the refined answer next to or in place of the first one, and
  highlight what changed and why. If the refinement agrees with the first answer, say so
  briefly instead of repeating it. Trigger the background step only when the request
  qualifies, such as when the user stays on the page or the question is marked high
  value.

diagram: respond-then-refine
diagram_caption: The user is never blocked. The refined answer arrives later and explains what changed, so the update builds trust instead of eroding it.

use_when:
  - Interactive tools where waiting 20+ seconds loses the user
  - Analysis questions where a first take is useful and a deeper one is better
  - Users can see an answer update in place (dashboards, chat with streaming UI)
  - You can tell which requests deserve the background pass
avoid_when:
  - The first answer will trigger an irreversible action
  - Channels that can't update a sent answer, such as SMS or email
  - Errors in the fast answer could mislead before the correction arrives

tradeoffs:
  latency:     { score: 1, note: "First answer in about a second; refinement later" }
  cost:        { score: 4, note: "Both models run on qualifying requests" }
  complexity:  { score: 3, note: "Background jobs, UI updates and change summaries" }
  reliability: { score: 3, note: "Final answer is strong; the first may be wrong" }
gains:
  - Feels instant without giving up depth
  - The diff between answers shows users where nuance lies
  - Natural place to measure when fast answers are good enough
costs:
  - Users may act on the first answer before the refinement lands
  - Answers that change can feel unreliable if not explained
  - Paying for two answers on every qualifying request

example:
  scenario: An executive asks a strategy assistant a question about initiative performance.
  steps:
    - who: Executive
      what: "“Which of our Q3 initiatives are behind plan?”"
    - who: Fast model
      what: "Within 1.5 seconds, lists 3 initiatives whose status field is Red, labeled `First take, deeper check running`."
    - who: Reasoning model
      what: "Runs in the background for 40 seconds. It compares milestones, spend and dates, not just status fields."
    - who: Refined answer
      what: "Appears below the first: “Two more are behind but still marked Green. Data Platform is 6 weeks late on its milestone and Partner Portal has spent 92% of budget at 60% scope.”"
    - who: Change note
      what: "The refined answer says what changed and why: “Status fields lag reality; I used milestone and spend data.” The executive forwards the refined version."

failures:
  - failure: Acting on the first take
    symptom: Decisions made before the refinement arrives
    fix: Label the first answer clearly; block actions until refined when stakes are high
  - failure: Unexplained flip-flops
    symptom: Refined answer contradicts the first with no explanation
    fix: Always include a short "what changed" note
  - failure: Refinement nobody sees
    symptom: User left; background work wasted
    fix: Only refine when the user is still engaged or the request is high value
  - failure: Redundant second answer
    symptom: Refinement repeats the first answer at length
    fix: When they agree, show a one-line confirmation instead

related:
  - { type: Variant of, pattern: talker-reasoner }
  - { type: Alternative, pattern: draft-verify }
  - { type: Alternative, pattern: fast-slow-escalation }
  - { type: Combines with, pattern: generative-ui }
  - { type: Combines with, pattern: budget-aware-planning }
---
