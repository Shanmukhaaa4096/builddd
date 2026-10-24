# ShikshaGap (Proof of Concept)

A diagnostic math assessment for Class 5 students that pinpoints foundational prerequisite gaps instead of just grading right or wrong.

When students struggle with adding unlike fractions, **ShikshaGap** dynamically steps back to test whether the underlying issue stems from **equivalent fractions** or **multiplication facts recall**.

## Features

- **Pure Diagnostic State Machine:** Decoupled engine tested against 17 automated unit and acceptance tests with zero DOM dependencies.
- **Dynamic Option Shuffling:** Options are randomized using Fisher-Yates shuffle on each display, preserving answer matching by value.
- **Adaptive Step-Back Banner:** Displays a clear prerequisite notification when stepping back to foundational levels.
- **Slip Protection:** Requires two misses on multiplication facts before confirming a foundational gap, treating a single miss as a slip.
- **Hard 6-Question Cap:** Terminates cleanly within 2 to 6 questions without overwhelming the student.
- **Sequential Diagnostic Audit Trail:** Explains the exact diagnostic rationale for why each question was asked.
- **Accessible UI:** Built with 48px+ touch targets, high-contrast colors, and dual visual icon + text labels (`✓ Correct!` / `✕ Not quite.`).

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Tests
```bash
npm test
```
Runs the full Vitest suite in single-run mode, executing mathematical data validation, invariant verification, option shuffling spread, and all 9 diagnostic sequences.

### Building for Production
```bash
npm run build
npm run preview
```

## Planning Documents

The project was built using a spec-driven, test-first workflow:
- [Scope Document](devpost/scope.md) / [Scope Companion HTML](devpost/scope.html)
- [Product Requirements Document (PRD)](devpost/prd.md) / [PRD Companion HTML](devpost/prd.html)
- [Technical Specification](devpost/spec.md) / [Spec Companion HTML](devpost/spec.html)
- [Build Checklist](devpost/checklist.md)
- [Code Tour & App Map](devpost/app-map.html)
