---
doc: scope
status: approved
---

# ShikshaGap (Proof of Concept)

A diagnostic math assessment for Class 5 students that pinpoints foundational prerequisite gaps instead of just grading right or wrong.

*Note: This is a brand-new codebase written completely from scratch in this repository for this hackathon, with no code reused from the learner's earlier project.*

## The Unique Kernel
When a student answers incorrectly, the quiz doesn't just show an explanation or another question of the same type—it dynamically steps backward down the concept prerequisite chain (Unlike Fractions → Equivalent Fractions → Multiplication Facts) to find the root foundation where understanding broke down.

## Who It's For
A Class 5 student sitting at a phone or laptop independently. When they struggle with fractions, traditional tests simply mark them low without explaining why. Today, students and parents are left guessing what went wrong, while ShikshaGap traces the difficulty directly to the unmastered earlier skill.

## The Core Loop
1. Open app to a simple start screen (title, one-sentence explainer, "Start" button—no login).
2. Answer a multiple-choice question with 4 shuffled options.
3. If answered correctly, the quiz presents a harder question at the next difficulty level.
4. If answered incorrectly, the quiz steps back to an earlier prerequisite concept (labeled with a clear indicator like "Checking an earlier concept: equivalent fractions").
5. The quiz concludes when the root gap is pinpointed or after ~6 questions.
6. The result screen displays the diagnosed root gap, the step-by-step reasoning trail of every answered question, and one actionable line on what to practice next.

## Inspiration & Identity
- Clean, encouraging, distraction-free interface tailored for a student working alone.
- Clear indicators when stepping back into a prerequisite concept so the student understands the diagnostic process rather than feeling penalized.
- Rebuilding the spirit of the original ShikshaGap concept as a lightweight, zero-dependency, verifiable proof of concept from scratch.

## Why This Matters to the Learner
The learner remembers finding math frustrating in school when falling behind without understanding where the gap was. This project explores how identifying foundational prerequisite gaps early can help students build confidence and master the fundamentals without confusion.

## What "Working" Looks Like
A 60–75 second demonstrable walkthrough:
1. Student clicks "Start" on the start screen.
2. Question 1 (Unlike Fractions, Medium): Student answers correctly → Quiz progresses up.
3. Question 2 (Unlike Fractions, Harder): Student intentionally misses → Quiz steps down to prerequisite.
4. Question 3 (Equivalent Fractions): Shows "Checking an earlier concept: equivalent fractions." Student misses again → Quiz steps down another level.
5. Question 4 (Multiplication Facts): Student answers correctly → Base concept confirmed.
6. Result Screen: Pinpoints "Your gap is equivalent fractions," presents the full question-by-question audit trail with reasoning ("You got multiplication facts right but missed equivalent fractions, so that is where to start"), and recommends the next practice step.
7. Verification that answer choices shuffle between questions (not always option A).
8. (Optional demo run): Fast second run where all answers are correct, yielding "no gap found / reached highest level."

## The POC Boundary
- **Target Topic:** Adding fractions with different denominators.
- **Prerequisite Hierarchy:** 3 levels (Level 3: Adding unlike fractions, Level 2: Equivalent fractions, Level 1: Multiplication facts).
- **Question Bank:** Fixed, pre-authored questions stored in a single local data file with difficulty and prerequisite tags.
- **Adaptive Engine:** In-memory diagnostic state machine tracking correct/incorrect responses, branching up on success and back on failure, terminating at ~6 questions max or when a gap is confirmed.
- **Result & Trail:** End screen displaying diagnosed gap, question history trail, diagnostic rationale, and a practice tip.

## Later
- Teacher and parent analytics dashboard.
- Printable diagnostic worksheets and curated video links.
- Multi-topic coverage (decimals, division, word problems) and multiple grade levels.
- Student accounts and historical progress tracking.
- AI-generated question variations.

## Explicitly Cut
- **Hindi and Telugu Translations:** Cut to keep content creation focused on English math terminology during the PoC.
- **Teacher Dashboard:** Cut because the PoC is strictly student-facing.
- **User Authentication / Accounts:** Cut to allow instant one-click testing without sign-up friction.
- **Cloud Database (Supabase):** Cut to eliminate backend latency, configuration overhead, and silent write failures; all state is handled cleanly in-memory.
- **Worksheet Generator:** Cut to keep the post-quiz experience focused on the diagnostic gap summary.
- **AI-Generated Questions at Runtime:** Cut to prevent hallucinations, formatting errors, or non-deterministic test runs; questions are curated in advance.
