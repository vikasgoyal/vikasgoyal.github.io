---
title: Talker–Reasoner
n: 32
family: fastslow
maturity: emg
axes: [coordination]
intent: A System 1 model keeps the conversation live while a System 2 model works in the background.
aka: fast talker / slow thinker, conversational front + reasoning back, dual-agent voice architecture
status: full

problem: >-
  Voice and live chat need replies within about a second, or the conversation feels broken.
  But the tasks people ask for, like rebooking travel or diagnosing an account, need multi-step
  reasoning and tool calls that take far longer. One model can't be both instant and
  thorough.
forces:
  - Conversation needs sub-second turn-taking and natural acknowledgements.
  - Real work needs reasoning and tools that take 5–30 seconds or more.
  - The user may keep talking, change their mind or add details mid-task.
  - Two models that each hold part of the state can contradict each other.

solution: >-
  Split the agent into two roles that run at the same time. The Talker is a fast model that
  owns the conversation: it acknowledges, asks clarifying questions and relays results in
  natural language. The Reasoner is a slower model that owns the task: it plans, calls
  tools and writes its findings and current beliefs to a shared memory. The Talker reads
  from that memory on every turn, so it can say what's known so far without waiting, and it
  passes new user input to the Reasoner as updates.

diagram: talker-reasoner
diagram_caption: The two models never block each other. Shared memory is the contract between them, so the Talker only says what the Reasoner has written down.

use_when:
  - Voice agents or live chat where silence feels broken
  - Tasks need tools or reasoning that take many seconds
  - Users add details or change requests while work is in progress
  - You want the conversational tone tuned separately from task logic
avoid_when:
  - Tasks finish in a second or two; one model is simpler
  - Asynchronous channels like email where waiting is fine
  - You can't afford two models running for every session

tradeoffs:
  latency:     { score: 1, note: "Talker replies in under a second; work continues behind it" }
  cost:        { score: 3, note: "Two models active per session" }
  complexity:  { score: 4, note: "Shared state, concurrency and interruption handling" }
  reliability: { score: 3, note: "Good if the Talker sticks to what's in memory" }
gains:
  - Natural, responsive conversation even during long tasks
  - Users can add details mid-task without restarting it
  - Tone and task logic can be tuned and evaluated separately
costs:
  - Two models and a shared state store to run and monitor
  - Race conditions when the user changes the request mid-task
  - Risk of the Talker promising something the Reasoner hasn't confirmed

example:
  scenario: A voice travel agent for a corporate travel desk. The traveler's 3pm flight was cancelled.
  steps:
    - who: Traveler
      what: "“My 3pm to Seattle got cancelled. Can you rebook me?”"
    - who: Talker
      what: "Replies in about 400 ms: “Sorry about that. I'm checking options now. Do you still need to land before your 6pm meeting?”"
    - who: Reasoner
      what: "Starts in parallel: pulls the booking, searches same-day flights, checks fare policy. Writes `status: searching` to memory."
    - who: Traveler
      what: "“Yes, and I'd prefer an aisle.”"
    - who: Talker
      what: "Passes `constraint: land_by 17:30, seat: aisle` to the Reasoner and says “Got it, aisle and before 5:30.”"
    - who: Reasoner
      what: "After 11 seconds, writes two options: a 4:10pm in-policy flight landing 6:20pm, and a 3:45pm flight landing 5:15pm that is $140 over policy. Flags that the second needs manager approval."
    - who: Talker
      what: Reads both from memory and explains the trade-off in two sentences. It doesn't claim either is booked.

failures:
  - failure: Talker overpromises
    symptom: Says "you're booked" before the Reasoner has confirmed
    fix: Talker may only state facts present in shared memory
  - failure: Stale constraints
    symptom: Reasoner finishes using details the user already changed
    fix: Version the task state; Reasoner re-checks before final output
  - failure: Awkward silence or chatter
    symptom: Talker repeats "still working" or goes quiet
    fix: Reasoner writes progress updates the Talker can relay
  - failure: Split-brain
    symptom: The two models hold different beliefs about the task
    fix: One shared memory as the source of truth; Talker keeps no task state

related:
  - { type: Combines with, pattern: fast-slow-escalation }
  - { type: Variant, pattern: respond-then-refine }
  - { type: Combines with, pattern: tiered-memory }
  - { type: Combines with, pattern: blackboard }
  - { type: Combines with, pattern: reflex-layer }
---
