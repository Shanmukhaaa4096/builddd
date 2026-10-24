---
doc: spec
status: approved
---

# ShikshaGap — Technical Spec

A client-side assessment for Class 5 students built with React, Vite, and TypeScript, with no backend and no external services. Uses a pure-function diagnostic state machine tested against 9 verifiable acceptance sequences, the longest diagnostic path, strict bank invariants, and automated mathematical data validation using Vitest.

*Source:* [prd.md > Features and Behavior](prd.md#features-and-behavior), [prd.md > Testable Acceptance Sequences](prd.md#testable-acceptance-sequences).

## How This Works, In Plain Language
The app has two distinct layers:
1. **The Diagnostic Engine (`src/engine/diagnosticEngine.ts`):** A pure TypeScript module with zero React or DOM dependencies. It never calls `Math.random` or `Date`. Given the current quiz state, an answer choice, and a required pseudo-random number generator (`rng: () => number`), it returns the next state—determining which question to ask next, whether to display the step-back banner, and declaring the final diagnosis when a termination condition is reached. Options are shuffled dynamically using `rng`, matching the stored `correctValue`.
2. **The View Layer (`src/components/`):** React components that simply render whatever state the engine returns. When the student clicks an option, the component locks the UI, highlights the choice, and forwards the action to the engine when "Next Question" is clicked, passing browser `Math.random` as the engine's `rng`.

This separation guarantees that the diagnostic logic can be thoroughly tested and mathematically proven with Vitest before any UI code is even run in a browser.

## The Core Journey Through the System
*PRD ref:* `prd.md > The Core Journey`
1. **App Mount:** React loads `App.tsx`, initializing engine state to `{ screen: 'START', ... }`.
2. **Start Click:** Student clicks "Start Diagnostic Quiz". The engine selects Question 1 (Level 3 Medium) from `src/data/questions.ts`, shuffles its 4 options using `rng`, and transitions to `{ screen: 'QUESTION', currentQuestion, ... }`.
3. **Option Selection:** Student taps an option. Local component state locks further clicks, highlights the option (green/salmon with check/cross icons and text), and shows "Next Question".
4. **Transition:** Clicking "Next Question" passes the selection to `submitAnswer(state, selectedOptionId, questionBank, rng)`. The engine evaluates:
   - If incorrect: steps back to prerequisite concept level (sets `showStepBackBanner: true`).
   - If Level 1 missed: triggers Level 1 confirmation check (sets `showStepBackBanner: false`).
   - If Level 3 answered correctly 3 times in a row: exits early with Mastery.
   - If gap confirmed or 6 questions answered: transitions to `{ screen: 'RESULT', result, ... }`.
5. **Result Render:** `ResultView.tsx` displays the standardized gap string, sequential question audit trail, and "Try Again" button.
6. **Try Again Click:** Dispatches `resetQuiz(questionBank, rng)` which returns a pristine starting state with freshly randomized question options.

## Stack and Tooling

### Dependencies
- **Core:** `react` (^18.3.1), `react-dom` (^18.3.1)
- **Build & Dev:** `vite` (^5.4.0), `@vitejs/plugin-react` (^4.3.0), `typescript` (^5.5.0)
- **Testing:** `vitest` (^2.0.0), `jsdom` (^24.1.0), `@testing-library/react` (^16.0.0), `@testing-library/jest-dom` (^6.4.0)

### Scripts
- `"dev": "vite"`: Launches local dev server with HMR.
- `"build": "tsc && vite build"`: Runs TypeScript strict checks and generates production bundle in `dist/`.
- `"preview": "vite preview"`: Serves the production build locally.
- `"test": "vitest run"`: Executes the full Vitest suite in single-run mode with reporting metrics.

## Where It Runs and How Someone Tries It

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Run Instructions
1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Run Automated Test Suite:**
   ```bash
   npm test
   ```
   *(All acceptance sequences, longest path, bank data validation, position shuffling, and invariant tests run in single-pass mode).*
3. **Start Local Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173`.
4. **Build and Preview Production Artifact:**
   ```bash
   npm run build
   npm run preview
   ```
5. **Demo Recording:** Local browser recording of `http://localhost:5173` running through the 60–75s sequence for Devpost submission.

## Look and Feel
*PRD ref:* `prd.md > Look and Feel`
All colors are defined as CSS Custom Properties in `src/index.css`:
```css
:root {
  --color-bg: #EEF4D4;              /* Cream background */
  --color-text-main: #1C2826;       /* Dark slate/forest text & buttons */
  --color-correct-fill: #DAEFB3;    /* Light green option fill */
  --color-wrong-fill: #EA9E8D;      /* Salmon option fill */
  --color-border-accent: #D64550;   /* Red borders and icons only; never text smaller than large heading size */
  --color-banner-bg: #1C2826;       /* Dark step-back banner background */
  --color-banner-text: #EEF4D4;     /* Cream step-back banner text */
  --radius-card: 14px;
  --radius-btn: 10px;
}
```
Accessibility is strictly enforced: correct and wrong states render an icon (`✓` or `✕`) alongside text labels (`Correct!` or `Not quite.`), never relying solely on color. No animations are used.

## Diagnostic Decision Table
This complete decision table defines every state transition, step-back banner trigger, and termination outcome in the engine:

| Current Situation | Answer | Next Question Level | Banner Flag | Result String If Quiz Ends |
| :--- | :--- | :--- | :--- | :--- |
| **L3 Step 1 (Medium)** | Correct | Level 3 (Harder) | `false` | *(continues)* |
| **L3 Step 2 (Harder)** | Correct | Level 3 (Hardest) | `false` | *(continues)* |
| **L3 Step 3 (Hardest)** | Correct | None (Ends) | `false` | `"No foundational gap found, you're ready for unlike fractions!"` |
| **L3 Step 1 (Medium)** | Wrong | Level 2 (Equivalent Fractions) | `true` | *(continues)* |
| **L3 Step 2 (Harder)** | Wrong | Level 2 (Equivalent Fractions) | `true` | *(continues)* |
| **L3 Step 3 (Hardest)** | Wrong | Level 2 (Equivalent Fractions) | `true` | *(continues)* |
| **L2 Equivalent Fractions** | Correct | None (Ends) | `false` | `"Your gap is adding unlike fractions."` |
| **L2 Equivalent Fractions** | Wrong | Level 1 (Multiplication Q1) | `true` | *(continues)* |
| **L1 Multiplication (Q1)** | Correct | None (Ends) | `false` | `"Your gap is equivalent fractions."` |
| **L1 Multiplication (Q1)** | Wrong (1st miss) | Level 1 (Multiplication Q2 Confirmation) | `false` | *(continues - slip check)* |
| **L1 Confirmation (Q2)** | Correct | None (Ends) | `false` | `"Your gap is equivalent fractions."` |
| **L1 Confirmation (Q2)** | Wrong | None (Ends) | `false` | `"Your gap is multiplication facts."` |
| **6-Question Cap Reached** | Any | None (Ends) | `false` | Evaluates lowest unmastered concept (e.g. `"Your gap is multiplication facts."`) |

## Engine Purity & Function Signatures
The diagnostic engine is pure. It never calls `Math.random()` or `Date.now()`. All randomness is injected via the required `rng: () => number` function parameter:
```typescript
export function createInitialState(): EngineState;

export function startQuiz(
  questionBank: Question[],
  rng: () => number
): EngineState;

export function submitAnswer(
  currentState: EngineState,
  selectedOptionId: string,
  questionBank: Question[],
  rng: () => number
): EngineState;

export function resetQuiz(
  questionBank: Question[],
  rng: () => number
): EngineState;
```

## How Tests Answer (Test Helpers)
Tests must never rely on option array index (0..3), option letter ('A'..'D'), or hardcoded option IDs. Instead, tests use two helper functions:
```typescript
export function answerCorrectly(state: EngineState): string {
  if (!state.currentQuestion) throw new Error("No active question to answer");
  const correct = state.currentQuestion.options.find(o => o.isCorrect);
  if (!correct) throw new Error("Question has no correct option marked");
  return correct.id;
}

export function answerWrongly(state: EngineState): string {
  if (!state.currentQuestion) throw new Error("No active question to answer");
  const wrong = state.currentQuestion.options.find(o => !o.isCorrect);
  if (!wrong) throw new Error("Question has no wrong options");
  return wrong.id;
}
```

## Curated Question Bank Specification (`src/data/questions.ts`)
The question bank contains 12 static, mathematically verified questions (4 questions per level across 3 levels). Every question stores its correct answer by value (`correctValue: string`), has **exactly 1 correct option**, and all 3 distractors are mathematically wrong:

### Stored Correct Answer by Value and Dynamic Shuffling
- Each `Question` defines `correctValue: string` (e.g., `"3/4"`, `"12"`).
- Options have `{ id: string, text: string, value: string, isCorrect: boolean }`.
- When presented to the learner, options are shuffled dynamically using `rng()`.
- An automated unit test verifies that over repeated shuffles with varied seeds, the correct option appears across all four positions (indexes 0, 1, 2, and 3).

### Level 3: Adding Unlike Fractions (4 questions)
- `q-l3-1`: $1/2 + 1/4 = 3/4$. Tier: Medium ($4$ is a multiple of $2$). Correct Value: `"3/4"`. Distractors: `"2/6"`, `"2/4"`, `"1/3"`.
- `q-l3-2`: $1/2 + 1/3 = 5/6$. Tier: Harder (coprime denominators). Correct Value: `"5/6"`. Distractors: `"2/5"`, `"1/5"`, `"2/6"`.
- `q-l3-3`: $2/3 + 3/5 = 19/15$. Tier: Hardest (coprime denominators, improper fraction). Correct Value: `"19/15"`. Distractors: `"5/8"`, `"6/15"`, `"11/15"`.
- `q-l3-4`: $1/4 + 1/8 = 3/8$. Tier: Medium ($8$ is a multiple of $4$). Correct Value: `"3/8"`. Distractors: `"1/4"`, `"1/2"`, `"5/8"`.

### Level 2: Equivalent Fractions (4 questions)
- `q-l2-1`: "Which fraction is equivalent to 1/2?" Correct Value: `"2/4"`. Distractors: `"2/3"`, `"1/3"`, `"2/5"`.
- `q-l2-2`: "Which fraction is equivalent to 2/3?" Correct Value: `"4/6"`. Distractors: `"3/4"`, `"2/6"`, `"4/9"`.
- `q-l2-3`: "Which fraction is equivalent to 3/4?" Correct Value: `"6/8"`. Distractors: `"3/8"`, `"6/12"`, `"5/8"`.
- `q-l2-4`: "Which fraction is equivalent to 3/5?" Correct Value: `"6/10"`. Distractors: `"4/5"`, `"6/15"`, `"3/10"`.

### Level 1: Multiplication Facts (4 questions with distinct correct answers: 12, 42, 20, 36)
- `q-l1-1`: $3 \times 4 = ?$. Correct Value: `"12"`. Distractors: `"7"`, `"10"`, `"14"`.
- `q-l1-2`: $7 \times 6 = ?$. Correct Value: `"42"`. Distractors: `"36"`, `"48"`, `"13"`.
- `q-l1-3`: $4 \times 5 = ?$. Correct Value: `"20"`. Distractors: `"15"`, `"24"`, `"25"`.
- `q-l1-4`: $6 \times 6 = ?$. Correct Value: `"36"`. Distractors: `"30"`, `"42"`, `"12"`.

### Deterministic Question Selection Algorithm
When picking an unasked question for target level $L$ (and difficulty $D$ if $L=3$):
1. Filter `questionBank` for questions where `q.level === L` (and `q.difficulty === D` if applicable) and `!state.askedQuestionIds.includes(q.id)`.
2. Sort the available questions deterministically by `q.id.localeCompare(...)`.
3. Pick index `Math.floor(rng() * available.length)`. This guarantees 100% deterministic test replay given a seeded PRNG.

## Automated Test Plan & Vitest Mapping

**Verification Rule:** Every sequence test asserts:
1. The total number of questions asked.
2. The exact standardized result string from the PRD.
3. The `showStepBackBanner` boolean flag on **each individual question** throughout the run.
4. Invariants: no quiz run ever exceeds 6 questions, and no quiz run ever repeats a question in its audit trail.

| Test ID | Category | Vitest Test Name in `diagnosticEngine.test.ts` | Detailed Step-by-Step Flow & Expected Invariant Result |
| :--- | :--- | :--- | :--- |
| **DATA-VAL-1** | Bank Validation | `should verify each question has exactly 1 correct option and correctValue matches option value` | Asserts every question has exactly 1 `isCorrect: true`, and that option's value strictly equals `q.correctValue`. |
| **DATA-VAL-2** | Bank Validation | `should verify no duplicate options exist within any question` | Asserts each question has 4 distinct option values and 4 distinct display texts. |
| **DATA-VAL-3** | Bank Validation | `should verify stored answer values match real mathematical solutions` | Mathematically evaluates fractions and products ($1/2+1/4=3/4$, $3 \times 4=12$, etc.) against `correctValue`. |
| **DATA-VAL-4** | Bank Validation | `should verify question bank has at least 4 questions per level and 12-15 total` | Bank size $\ge 12$ and $\le 15$; L1 $\ge 4$, L2 $\ge 4$, L3 $\ge 4$. |
| **SHUF-POS** | Shuffling Test | `should verify correct answer appears across all 4 positions over multiple shuffles` | Runs 50 random shuffles with distinct seeds and asserts that indices 0, 1, 2, and 3 each hold the correct answer at least once. |
| **INVAR-1** | Invariant Test | `should guarantee no run ever exceeds 6 questions across all branch paths` | Exhaustively verifies that under any combination of right/wrong answers, quiz terminates at $\le 6$ questions. |
| **INVAR-2** | Invariant Test | `should guarantee no run ever repeats a question in its audit trail` | Verifies `askedQuestionIds` contains strictly unique IDs across all paths. |
| **SEQ-1** | Sequence 1 (Demo Journey) | `should diagnose equivalent fractions on L3 hard miss + L2 miss + L1 pass` | • Q1 L3 medium, right, banner off<br>• Q2 L3 harder, wrong, banner off<br>• Q3 L2, wrong, banner ON<br>• Q4 L1, right, banner ON<br>**Result:** 4 questions; `"Your gap is equivalent fractions."` |
| **SEQ-2** | Sequence 2 (Deep Mult Gap) | `should diagnose multiplication facts on L3 miss + L2 miss + two L1 misses` | • Q1 L3 medium, wrong, banner off<br>• Q2 L2, wrong, banner ON<br>• Q3 L1, wrong, banner ON<br>• Q4 L1 confirmation, wrong, banner off<br>**Result:** 4 questions; `"Your gap is multiplication facts."` |
| **SEQ-3** | Sequence 3 (Slip Recovery) | `should treat first L1 miss as slip when confirmed on second L1 question` | • Q1 L3 medium, wrong, banner off<br>• Q2 L2, wrong, banner ON<br>• Q3 L1, wrong, banner ON<br>• Q4 L1 confirmation, right, banner off<br>**Result:** 4 questions; `"Your gap is equivalent fractions."` |
| **SEQ-4** | Sequence 4 (Direct L3 Gap) | `should diagnose adding unlike fractions when L2 prerequisite is passed after L3 med miss` | • Q1 L3 medium, wrong, banner off<br>• Q2 L2, right, banner ON<br>**Result:** 2 questions; `"Your gap is adding unlike fractions."` |
| **SEQ-5** | Sequence 5 (Mastery Run) | `should declare mastery when 3 consecutive L3 difficulties pass` | • Q1 L3 medium, right, banner off<br>• Q2 L3 harder, right, banner off<br>• Q3 L3 hardest, right, banner off<br>**Result:** 3 questions; `"No foundational gap found, you're ready for unlike fractions!"` |
| **SEQ-6** | Sequence 6 (Restart & Reset) | `should reset state cleanly to initial on resetQuiz` | • Complete any run $\rightarrow$ trigger `resetQuiz`<br>**Result:** State returns to initial (0 questions asked, clean history, new options order) |
| **SEQ-7** | Sequence 7 (Longest Path / 6-Q Cap) | `should execute longest path to exactly 6 questions without exceeding cap` | • Q1 L3 med, right, banner off<br>• Q2 L3 harder, right, banner off<br>• Q3 L3 hardest, wrong, banner off<br>• Q4 L2, wrong, banner ON<br>• Q5 L1, wrong, banner ON<br>• Q6 L1 confirmation, wrong, banner off<br>**Result:** Exactly 6 questions; `"Your gap is multiplication facts."` Terminated; never asks Q7. |
| **SEQ-8** | Sequence 8 (L3 Hard Miss + L2 Pass) | `should diagnose adding unlike fractions on L3 med pass + L3 hard miss + L2 pass` | • Q1 L3 medium, right, banner off<br>• Q2 L3 harder, wrong, banner off<br>• Q3 L2, right, banner ON<br>**Result:** 3 questions; `"Your gap is adding unlike fractions."` |
| **SEQ-9** | Sequence 9 (L3 Hardest Miss + L2 Pass) | `should diagnose adding unlike fractions on L3 med pass + L3 hard pass + L3 hardest miss + L2 pass` | • Q1 L3 medium, right, banner off<br>• Q2 L3 harder, right, banner off<br>• Q3 L3 hardest, wrong, banner off<br>• Q4 L2, right, banner ON<br>**Result:** 4 questions; `"Your gap is adding unlike fractions."` |
| **BANNER-1** | Banner Integrity | `should verify banner is true only on step-back questions and false on confirmation/mastery` | Banner is `true` only on step-back (L3 $\rightarrow$ L2, L2 $\rightarrow$ L1); `false` on Q1, `false` on L1 confirmation, `false` on all questions of a mastery run. |
| **UI-E2E** | Demo Journey UI Test | `should render and complete full demo journey in React Testing Library` | (`App.test.tsx`) Verifies banner, lock on click, icon + text accessibility, and final verdict in DOM |

## File Structure
```
shikshagap/
├── devpost/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── scope.html
│   ├── prd.md
│   ├── prd.html
│   ├── spec.md
│   └── spec.html
├── src/
│   ├── data/
│   │   └── questions.ts            # Curated 12-question bank with correctValue & math rigor
│   ├── engine/
│   │   ├── diagnosticEngine.ts     # Pure state transition machine with required rng & dynamic shuffling
│   │   ├── diagnosticEngine.test.ts # Vitest suite covering all sequences, longest path, bank data val & invariants
│   │   └── testHelpers.ts          # answerCorrectly and answerWrongly test helpers
│   ├── types/
│   │   ├── question.ts             # Question & Option type definitions with correctValue
│   │   └── engine.ts               # Engine state, audit, and result types
│   ├── components/
│   │   ├── StartView.tsx           # Initial start card
│   │   ├── QuestionView.tsx        # Question card, progress, step-back banner, next CTA
│   │   ├── OptionCard.tsx          # Accessible option with check/cross icons + text
│   │   └── ResultView.tsx          # Verdict, audit trail, practice advice, try again CTA
│   ├── App.tsx                     # Top-level view switcher
│   ├── App.test.tsx                # End-to-end React Testing Library integration test
│   ├── index.css                   # Coolors CSS custom properties & base typography
│   └── main.tsx                    # Vite entry point
├── index.html                      # HTML root
├── package.json                    # Dependencies & "test": "vitest run"
├── tsconfig.json                   # TypeScript strict compiler options
├── tsconfig.node.json              # TypeScript config for Vite
└── vite.config.ts                  # Vite + Vitest configuration with jsdom
```

## Important Failure Modes
1. **Student Double-Clicks or Taps Multiple Options Rapidly:**
   - *Risk:* Multiple state transitions or submitting twice before question re-renders.
   - *Mitigation:* `OptionCard` and `QuestionView` immediately set `isLocked: true` upon first tap, disabling click handlers on all option buttons.
2. **Question Bank Exhaustion on Extreme Branching:**
   - *Risk:* Engine cannot find an unasked question for the target level.
   - *Mitigation:* The question bank contains 12 questions (4 at L3, 4 at L2, 4 at L1), strictly exceeding the 6-question worst-case path.
3. **Viewport Overflow on Small Mobile Screens:**
   - *Risk:* 4 tall options plus feedback banner push the "Next Question" button below the fold.
   - *Mitigation:* Clean flex layout with compact margin spacing and automatic vertical scrolling on mobile containers.

## What Was Simplified and Why
- **Pure In-Memory State instead of Redux/Zustand:** The state machine is completely self-contained in a single pure TypeScript file; adding state management libraries would add boilerplate with zero benefit.
- **Static Curated Array instead of Backend API:** Question fetching has 0ms latency, 0 network failure points, and deterministic testability.
- **Single-Page Conditional Views instead of React Router:** The app only has three screens (`START`, `QUESTION`, `RESULT`); standard routing adds bundle weight and URL edge cases without serving the 60s demo.

## Decisions and Open Issues

### Checked Items
- **Mathematical Integrity:** All 12 questions in the curated bank have been verified to have exactly one correct option, stored by value, matching real mathematics, and three mathematically incorrect distractors.
- **Branching Completeness:** The decision table explicitly accounts for all 9 question progression paths, the slip-protection confirmation check, and the hard 6-question cap.
- **Dynamic Shuffling:** Questions shuffle options on display via injected `rng`, verified across all 4 positions in tests.
- **No Question Repeats & Max 6 Questions:** Invariant tests guarantee no question is repeated and no run exceeds 6 questions.
- **Color Accessibility:** High-contrast pairing verified for `--color-bg` (#EEF4D4) and `--color-text-main` (#1C2826); dual icon and text feedback implemented for colorblind students.

### Resolved Architecture Decisions
- **Engine Purity:** Engine functions require an explicit `rng: () => number` parameter and never invoke `Math.random` or `Date.now` internally, enabling 100% deterministic testing.
- **Test Option Independence:** Tests select options via semantic `isCorrect` lookup helpers (`answerCorrectly` and `answerWrongly`) rather than brittle letter or index assumptions.
- **Single Run Testing:** Configured `"test": "vitest run"` so automated runs finish immediately.

### Remaining Build Verifications
- Verify `@testing-library/jest-dom` matcher registration inside `vite.config.ts`.
- Verify mobile viewport CSS constraints so tap targets stay $\ge 48$px without layout cutoffs.
