---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Scaffold project, question bank, and mathematical data validation tests**
  Becomes usable: A runnable Vite + React + TypeScript project with the curated 12-question math bank in `src/data/questions.ts` and automated mathematical data validation tests passing via Vitest.
  Why now: Bootstraps the tooling and verifies the mathematical integrity of all 12 questions (correct values, distractors, minimum per level) before the diagnostic engine uses them.
  PRD ref: `prd.md > Features and Behavior` (Question Bank and Prerequisite Chain)
  Spec ref: `spec.md > Stack and Tooling`, `spec.md > Curated Question Bank Specification`, `spec.md > Automated Test Plan` (DATA-VAL-1 to DATA-VAL-4)
  Build: Initialize Vite React TypeScript project, configure Vitest with jsdom and testing-library, define question types (`correctValue`), implement the 12-question bank (4 L3, 4 L2, 4 L1), and write data validation tests.
  Verify (mechanical): Run `npm test` to verify all data validation tests pass; run `npm run build` to verify clean TypeScript compilation.
  Learner check: Run `npm test` and inspect `src/data/questions.ts` to see all 12 questions and their verified mathematical values passing.
  Commit: `Scaffold project and verify 12-question bank with data validation tests`

- [x] **2. Pure diagnostic engine with dynamic shuffling and acceptance test suite**
  Becomes usable: The complete diagnostic state machine module in `src/engine/diagnosticEngine.ts` tested and proven against all 9 PRD acceptance sequences, the longest path, option position spread, and engine invariants.
  Why now: The unique kernel of ShikshaGap is its diagnostic logic. Building and proving it with pure unit tests before touching UI code prevents false positives and guarantees the diagnostic algorithm works.
  PRD ref: `prd.md > Features and Behavior` (The Core Diagnostic Engine), `prd.md > Testable Acceptance Sequences` (Sequences 1 through 9)
  Spec ref: `spec.md > Diagnostic Decision Table`, `spec.md > Engine Purity & Function Signatures`, `spec.md > Automated Test Plan` (SEQ-1 to SEQ-9, SHUF-POS, INVAR-1, INVAR-2)
  Build: Implement `diagnosticEngine.ts` with pure state transitions, injected `rng`, Fisher-Yates dynamic option shuffling, and test helpers in `testHelpers.ts`. Write comprehensive test suite in `diagnosticEngine.test.ts`.
  Verify (mechanical): Run `npm test` to verify all 9 acceptance sequences, the 6-question longest path, position shuffling, and invariant checks pass.
  Learner check: Run `npm test` and review the passing sequence reports showing exact banner flags and standardized gap verdicts.
  Commit: `Implement pure diagnostic engine with dynamic shuffling and acceptance test suite`

- [x] **3. Accessible interactive UI and full-app integration**
  Becomes usable: A responsive web app running at `http://localhost:5173` allowing a student to start the quiz, answer questions with immediate click-locking and dual visual/text feedback, see step-back banners, view results with an audit trail, and restart cleanly.
  Why now: Connects the verified pure engine to the user interface, delivering the full student-facing experience with the Coolors design system.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Look and Feel`, `spec.md > File Structure`, `spec.md > Automated Test Plan` (UI-E2E)
  Build: Implement `StartView`, `OptionCard`, `QuestionView`, `ResultView`, `App.tsx`, `index.css` (custom properties and responsive layout), and `App.test.tsx` integration test.
  Verify (mechanical): Run `npm test` to verify all engine and UI integration tests pass; run `npm run build` for production bundle; start dev server and verify HTTP 200 at `http://localhost:5173`.
  Learner check: Open `http://localhost:5173` in a browser, complete the demo quiz flow, observe the step-back banner, and test the "Try Again" reset button.
  Commit: `Implement accessible UI views and connect diagnostic engine to React app`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — Slice 2 (pure diagnostic engine and test sequence outputs)
- [ ] Final kick-the-tires exploration and feedback completed — Slice 3 (interactive browser app)

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [to be filled upon completion]
Route and stops: [to be filled upon completion]
Edit outcome: [to be filled upon completion]
Reflection: [to be filled upon completion]
Activity mode: [to be filled upon completion]

## Revisions

