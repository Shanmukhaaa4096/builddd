---
doc: prd
status: approved
---

# ShikshaGap — Product Requirements

A diagnostic math assessment for Class 5 students that traces errors in adding unlike fractions back to prerequisite concept gaps (equivalent fractions or multiplication facts).

*Source:* [scope.md > The Core Loop](scope.md#the-core-loop), [scope.md > The POC Boundary](scope.md#the-poc-boundary), [scope.md > What "Working" Looks Like](scope.md#what-working-looks-like).

## The Core Journey
1. **Arrival:** Student opens the application on mobile or desktop to a clean, welcoming Start screen. No login, credentials, or profile setup required.
2. **Start:** Student taps the "Start Diagnostic Quiz" button. The diagnostic engine initializes in memory and presents Question 1 (Level 3 Medium: Adding Unlike Fractions).
3. **Question Interaction:**
   - Student reads the math question and 4 shuffled multiple-choice options.
   - Student taps an option: selection immediately locks to prevent multiple guesses.
   - Instant visual feedback: Correct option highlights in light green with a checkmark and "Correct!" message; wrong selection highlights in salmon with a red border, an "X" icon, and "Not quite." message (while also highlighting the true correct answer in green).
   - If stepping back to a lower concept level, a high-contrast dark banner announces: *"Checking an earlier concept: [concept name]"*.
   - A large "Next Question" button appears.
4. **Adaptive Diagnostic Flow:**
   - Correct answers advance the student forward or upward in difficulty.
   - Incorrect answers step the student backward to the prerequisite concept level.
   - Missing Level 1 triggers a second, different Level 1 question to distinguish a careless slip from a true conceptual gap.
   - Answering all 3 Level 3 difficulties correctly exits early at Question 3 with a Mastery result.
5. **Completion & Diagnosis:**
   - Once the root gap is pinpointed or 6 questions are answered, the app displays the Result screen.
   - Clearly declares the standardized result text.
   - Displays a chronological question-by-question audit trail showing every question asked, student choice, correct/incorrect badge, and diagnostic reasoning.
   - Shows one clear sentence on what to practice next.
6. **Restart:** Student taps "Try Again" to reset the quiz in memory and begin a fresh run with reshuffled option positions.

## Screens and Layout

### 1. Start Screen
- **Header:** App title **ShikshaGap** with a one-sentence subtitle: *"Find out why fractions feel tricky by discovering your math stepping stones."*
- **Call to Action:** Prominent "Start Diagnostic Quiz" button centered on the screen.
- **Layout:** Centered single-column card, comfortable for both vertical mobile screens and desktop browsers.

### 2. Question Screen
- **Progress Counter:** Top line indicating *"Question X"* (e.g., *"Question 1"*, *"Question 2"*, etc.—without "of 6", since most runs terminate in 2 to 4 questions) and current topic badge.
- **Diagnostic Step-Back Banner:** High-contrast banner displayed **only when the quiz steps back to a lower level** (Level 3 to Level 2, or Level 2 to Level 1): *"Checking an earlier concept: Equivalent Fractions"* or *"Checking an earlier concept: Multiplication Facts"*.
  - *Banner Rule:* The banner does NOT appear on the Level 1 confirmation question, and it never appears on a run that ends in mastery.
- **Question Card:** Rounded card displaying the question prompt in large, clean typography.
- **Option Grid/List:** 4 vertical option cards with generous tap targets (minimum 48px height for touch).
- **Feedback Block:** Sub-block appearing beneath options after selection with text and icon feedback.
- **Action Button:** Large "Next Question" button appearing only after an option is selected.

### 3. Result Screen
- **Verdict Banner:** Prominently announces the diagnosed gap using standardized wording:
  - `"Your gap is multiplication facts."`
  - `"Your gap is equivalent fractions."`
  - `"Your gap is adding unlike fractions."`
  - `"No foundational gap found, you're ready for unlike fractions!"`
- **Diagnostic Audit Trail:** Sequential list of cards for each question answered:
  - Question number and concept level.
  - Question text and the student's answer.
  - Result badge (Green Check / Red X).
  - Diagnostic reason line (e.g., *"Missed Level 3 → Stepped back to check Level 2"*).
- **Summary Rationale:** Clear diagnosis narrative explaining why the conclusion was reached.
- **Next Practice Step:** A single actionable recommendation line.
- **Reset Action:** "Try Again" button that resets state and returns to Question 1 with freshly shuffled option orders.

## Look and Feel
- **Color Palette (grounded in Coolors palette):**
  - **Background:** Cream (`#EEF4D4`)
  - **Text & Main Action Buttons:** Dark Forest Green / Slate (`#1C2826`)
  - **Correct Option Fill:** Light Green (`#DAEFB3`)
  - **Incorrect Option Fill:** Salmon (`#EA9E8D`)
  - **Borders & Error Highlights:** Red (`#D64550`)
  - **Step-Back Banner:** Dark background (`#1C2826`) with cream text (`#EEF4D4`)
- **Accessibility:** Colorblind-friendly design where every state change uses an icon (✓ or ✗) and clear descriptive words ("Correct!" / "Not quite."), never relying on color alone.
- **Typography & Components:**
  - Modern, highly legible sans-serif font (system clean stack or Inter).
  - Rounded container cards (border-radius: 12px–16px).
  - Large tap targets designed for thumbs on mobile devices.
  - Strictly no animations.

## Features and Behavior

### Diagnostic Hierarchy & Minimum Question Bank
The pre-authored question bank contains static, mathematically verified problems categorized across 3 levels.
**Mathematical Rigor Rule:** Every question in the bank has **exactly one correct option**, and all distractors must be mathematically wrong. Check every question in the bank against this rule.

**Minimum Question Bank Requirements:**
- **Level 3: Adding Unlike Fractions (At least 3 questions)**
  - Step 1: Medium (e.g., $1/2 + 1/4 = 3/4$)
  - Step 2: Harder (e.g., $1/2 + 1/3 = 5/6$)
  - Step 3: Hardest (e.g., $2/3 + 3/5 = 19/15$)
- **Level 2: Equivalent Fractions (At least 2 questions)**
  - Questions testing fraction conversion (e.g., $1/2 = ?/4 \rightarrow 2/4$ with distractors $2/3, 1/3, 2/5$, or $2/3 = ?/6 \rightarrow 4/6$)
- **Level 1: Multiplication Facts (At least 2 questions)**
  - Two distinct multiplication questions essential for common denominators (e.g., $3 \times 4 = 12$ and $2 \times 6 = 12$). The two questions are different so the confirmation question is never a repeat. No question is ever repeated within one run.

### State Machine & Branching Rules
1. **Root Gap Definition:** The root gap is the lowest concept level in the hierarchy where the student demonstrated an unmastered skill, provided the level below it was confirmed mastered (or if it is the bottom of the chain).
2. **Option Shuffling:** The 4 answer choices for each question are shuffled on render so the correct answer is randomized across positions.
3. **Level 3 Mastery Shortcut:** If the student answers Level 3 Medium, Level 3 Harder, and Level 3 Hardest correctly, the quiz finishes immediately at 3 questions with `"No foundational gap found, you're ready for unlike fractions!"`.
4. **Step-Back Logic:**
   - Incorrect at Level 3 → Step down to Level 2 (triggers step-back banner).
   - Incorrect at Level 2 → Step down to Level 1 (triggers step-back banner).
5. **Level 1 Slip Confirmation Rule:**
   - Only the Level 1 multiplication check gets a confirmation question. This is deliberate, to keep the maximum run at 6 questions. A single miss at Level 3 or Level 2 is taken at face value.
   - If Level 1 is answered incorrectly, the engine immediately presents a second, different Level 1 question (no banner on this confirmation question).
   - If the second Level 1 question is also missed → Confirmed root gap is `"Your gap is multiplication facts."`; quiz finishes.
   - If the second Level 1 question is answered correctly → The first miss is treated as a slip; Level 1 counts as mastered, confirming the root gap is `"Your gap is equivalent fractions."`; quiz finishes.
6. **Direct Level 3 Gap:**
   - If Level 3 is missed, but Level 2 is answered correctly → Root gap is `"Your gap is adding unlike fractions."`; quiz confirms earlier foundation is solid and finishes.
7. **Hard Limits:**
   - Hard cap of 6 questions max. It never asks a 7th question under any circumstances.
   - No question is ever repeated within a single run.

## Standardized Result Wording
The application, PRD, spec, and verification tests must use exactly these standardized strings:
- `"Your gap is multiplication facts."`
- `"Your gap is equivalent fractions."`
- `"Your gap is adding unlike fractions."`
- `"No foundational gap found, you're ready for unlike fractions!"`

## Testable Acceptance Sequences (Verifiable Test Plan)

These 7 concrete test paths define what "working" looks like and will be tested during the build:

### Sequence 1: Full Step-Back to Equivalent Fractions (The Demo Journey)
- **Q1:** Level 3 Medium → Answer **Correct** (advances to Q2 Level 3 Harder).
- **Q2:** Level 3 Harder → Answer **Wrong** (steps back to Level 2 with banner).
- **Q3:** Level 2 (Equivalent Fractions) → Answer **Wrong** (steps back to Level 1 with banner).
- **Q4:** Level 1 (Multiplication Facts) → Answer **Correct** (verifies Level 1 foundation).
- **Expected Result:** Ends at 4 questions.
  - Declares: `"Your gap is equivalent fractions."`
  - Rationale: *"You got multiplication facts right but missed equivalent fractions, so that is where to start."*

### Sequence 2: Deep Foundation Gap (Multiplication Facts with Slip Confirmation)
- **Q1:** Level 3 Medium → Answer **Wrong** (steps back to Level 2 with banner).
- **Q2:** Level 2 → Answer **Wrong** (steps back to Level 1 with banner).
- **Q3:** Level 1 (First Question) → Answer **Wrong** (triggers confirmation question, no banner).
- **Q4:** Level 1 (Second Question) → Answer **Wrong** (confirms deep foundation gap).
- **Expected Result:** Ends at 4 questions.
  - Declares: `"Your gap is multiplication facts."`
  - Rationale: *"Multiplication facts are the foundation for equivalent fractions and common denominators. Start here to make fractions easier."*

### Sequence 3: Level 1 Slip Recovery
- **Q1:** Level 3 Medium → Answer **Wrong** (steps back to Level 2 with banner).
- **Q2:** Level 2 → Answer **Wrong** (steps back to Level 1 with banner).
- **Q3:** Level 1 (First Question) → Answer **Wrong** (triggers confirmation question, no banner).
- **Q4:** Level 1 (Second Question) → Answer **Correct** (slip recovered, confirms Level 1 mastered).
- **Expected Result:** Ends at 4 questions.
  - Declares: `"Your gap is equivalent fractions."`
  - Rationale: *"Multiplication facts are solid, but equivalent fractions need practice."*

### Sequence 4: Direct Level 3 Gap (Solid Foundation)
- **Q1:** Level 3 Medium → Answer **Wrong** (steps back to Level 2 with banner).
- **Q2:** Level 2 → Answer **Correct** (confirms Level 2 foundation is solid).
- **Expected Result:** Ends at 2 questions.
  - Declares: `"Your gap is adding unlike fractions."`
  - Rationale: *"Your prerequisite skills (equivalent fractions and multiplication) are solid! You just need practice with the final step of adding numerators over common denominators."*

### Sequence 5: Clean Mastery Run
- **Q1:** Level 3 Medium → Answer **Correct** (advance to Harder).
- **Q2:** Level 3 Harder → Answer **Correct** (advance to Hardest).
- **Q3:** Level 3 Hardest → Answer **Correct** (all 3 difficulty tiers mastered).
- **Expected Result:** Ends cleanly at 3 questions.
  - Declares: `"No foundational gap found, you're ready for unlike fractions!"`
  - No step-back banners ever displayed.

### Sequence 6: In-Memory Restart & Randomization
- On Result screen, tap "Try Again".
- **Expected Result:** Instantly displays Question 1 without browser reload. Option positions are newly randomized (verified not always option A).

### Sequence 7: The 6-Question Cap Test
- **Q1:** Level 3 Medium → Answer **Correct** (advance to Harder).
- **Q2:** Level 3 Harder → Answer **Correct** (advance to Hardest).
- **Q3:** Level 3 Hardest → Answer **Wrong** (steps back to Level 2 with banner).
- **Q4:** Level 2 Equivalent Fractions → Answer **Wrong** (steps back to Level 1 with banner).
- **Q5:** Level 1 Multiplication (First Question) → Answer **Wrong** (triggers confirmation question, no banner).
- **Q6:** Level 1 Multiplication (Second Question) → Answer **Wrong** (confirms deep foundation gap).
- **Expected Result:** Ends at exactly 6 questions. It never asks a 7th question.
  - Declares: `"Your gap is multiplication facts."`
  - Rationale: *"Multiplication facts are the foundation for equivalent fractions and common denominators. Start here to make fractions easier."*

## States and Boundaries
- **Initial State:** Start screen visible, score and question index at zero, question bank shuffled.
- **Answering State:** Options interactive; tap locks options, reveals colors, icons, text labels, and "Next Question" button.
- **Transition State:** Clicking "Next" evaluates branching condition, updates question index, and renders next question or result screen.
- **Result State:** In-memory diagnostic summary, audit trail, practice advice, and "Try Again" CTA.
- **Persistence:** In-memory only. No local storage, cookies, or database state. Page reload resets to Start screen.

## Product Decisions
- **In-Memory State over Database:** Avoids network latency, credentials, and silent backend failures.
- **Static Pre-Authored Questions over Runtime AI:** Guarantees question mathematical accuracy, deterministic answer options, and eliminate API timeouts.
- **Deliberate Slip-Protection Boundary:** Only the Level 1 multiplication check gets a confirmation question. This is deliberate, to keep the maximum run at 6 questions. A single miss at Level 3 or Level 2 is taken at face value.
- **Progress Label Without Total:** Displays "Question X" instead of "Question X of 6" because runs dynamically end anywhere between 2 and 6 questions.
- **Banner Exclusivity:** The step-back banner only appears on true level regressions, keeping the UI informative without false alerts on retries or mastery runs.
- **Accessibility by Default:** Combines color, text, and icons for all validation states.

## What We're Building
- Complete single-page diagnostic web application matching the specified color palette.
- Pre-authored curated math question set for Fractions (unlike denominators, equivalent fractions, multiplication facts).
- Adaptive diagnostic state machine implementing the 7 testable sequences.
- Start screen, Question interface with locked selection and immediate feedback, Step-back notice banner, and Result screen with complete audit trail.

## Deferred From the POC
- **Teacher/Parent Portal:** Class-level reporting and assignment distribution.
- **Printable PDF Worksheets:** Auto-generated practice worksheets based on the diagnosed gap.
- **User Accounts & Cloud Sync:** Storing long-term student growth over time.
- **Multiple Math Topics:** Decimals, geometry, percentages, algebraic thinking.

## Non-Goals
- Real-time multiplayer or competitive leaderboards.
- Open-ended essay or free-text math input (strictly multiple choice for unambiguous PoC grading).
- Multilingual audio or video explanations.

## Open Questions
None. All branching logic, colors, acceptance test sequences, and PoC boundaries are fully resolved.
