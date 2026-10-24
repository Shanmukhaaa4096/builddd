import { describe, it, expect } from 'vitest';
import { QUESTION_BANK } from '../data/questions';
import {
  startQuiz,
  submitAnswer,
  resetQuiz,
  createInitialState,
  VERDICTS,
} from './diagnosticEngine';
import { answerCorrectly, answerWrongly } from './testHelpers';
import { EngineState } from '../types/engine';

// Deterministic Pseudo-Random Number Generator for reproducible tests
function createLcg(seed = 12345): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

describe('Diagnostic Engine Test Suite', () => {
  it('SHUF-POS: should verify correct answer appears across all 4 positions over multiple shuffles', () => {
    const positionsSeen = new Set<number>();

    // Test 50 different runs with distinct seeds
    for (let seed = 1; seed <= 50; seed++) {
      const rng = createLcg(seed);
      const state = startQuiz(QUESTION_BANK, rng);
      const q = state.currentQuestion!;
      const correctIndex = q.options.findIndex(o => o.isCorrect);
      expect(correctIndex).toBeGreaterThanOrEqual(0);
      expect(correctIndex).toBeLessThan(4);
      positionsSeen.add(correctIndex);
    }

    // All four positions (0, 1, 2, 3) must have hosted the correct answer
    expect(positionsSeen.has(0), 'Position 0 must host correct option').toBe(true);
    expect(positionsSeen.has(1), 'Position 1 must host correct option').toBe(true);
    expect(positionsSeen.has(2), 'Position 2 must host correct option').toBe(true);
    expect(positionsSeen.has(3), 'Position 3 must host correct option').toBe(true);
    expect(positionsSeen.size).toBe(4);
  });

  it('INVAR-1 & INVAR-2: should guarantee no run ever exceeds 6 questions and never repeats a question', () => {
    // Recursively walk every possible right/wrong decision tree
    function walkTree(state: EngineState, rng: () => number) {
      if (state.screen === 'RESULT') {
        expect(state.auditTrail.length).toBeLessThanOrEqual(6);
        expect(state.askedQuestionIds.length).toBe(new Set(state.askedQuestionIds).size);
        return;
      }

      expect(state.auditTrail.length).toBeLessThan(6);

      // Branch 1: Answer correctly
      const correctAns = answerCorrectly(state);
      const nextCorrect = submitAnswer(state, correctAns, QUESTION_BANK, rng);
      walkTree(nextCorrect, rng);

      // Branch 2: Answer wrongly
      const wrongAns = answerWrongly(state);
      const nextWrong = submitAnswer(state, wrongAns, QUESTION_BANK, rng);
      walkTree(nextWrong, rng);
    }

    // Test across several seeds
    for (let seed = 101; seed <= 105; seed++) {
      const rng = createLcg(seed);
      const initial = startQuiz(QUESTION_BANK, rng);
      walkTree(initial, rng);
    }
  });

  it('BANNER-1: should verify banner is true only on step-back questions and false on confirmation/mastery', () => {
    const rng = createLcg(42);
    let state = startQuiz(QUESTION_BANK, rng);

    // Q1 is starting question -> banner false
    expect(state.showStepBackBanner).toBe(false);

    // Q1 miss -> steps back to Level 2 -> banner true
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);
    expect(state.currentQuestion?.level).toBe(2);
    expect(state.showStepBackBanner).toBe(true);
    expect(state.stepBackMessage).toContain('Equivalent Fractions');

    // Q2 miss -> steps back to Level 1 -> banner true
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);
    expect(state.currentQuestion?.level).toBe(1);
    expect(state.showStepBackBanner).toBe(true);
    expect(state.stepBackMessage).toContain('Multiplication Facts');

    // Q3 miss (1st miss at L1) -> asks L1 confirmation Q2 -> banner FALSE (not a step-back)
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);
    expect(state.currentQuestion?.level).toBe(1);
    expect(state.showStepBackBanner).toBe(false);
  });

  it('SEQ-1: should diagnose equivalent fractions on L3 hard miss + L2 miss + L1 pass', () => {
    const rng = createLcg(1);
    let state = startQuiz(QUESTION_BANK, rng);

    // Q1: L3 Medium -> Right
    expect(state.currentQuestion?.level).toBe(3);
    expect(state.showStepBackBanner).toBe(false);
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    // Q2: L3 Harder -> Wrong
    expect(state.currentQuestion?.level).toBe(3);
    expect(state.showStepBackBanner).toBe(false);
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Q3: L2 Equivalent Fractions -> Wrong
    expect(state.currentQuestion?.level).toBe(2);
    expect(state.showStepBackBanner).toBe(true);
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Q4: L1 Multiplication Facts -> Right
    expect(state.currentQuestion?.level).toBe(1);
    expect(state.showStepBackBanner).toBe(true);
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    // Verdict check
    expect(state.screen).toBe('RESULT');
    expect(state.auditTrail.length).toBe(4);
    expect(state.result?.verdict).toBe(VERDICTS.EQUIVALENT_FRACTIONS);
    expect(state.result?.identifiedGap).toBe('equivalent_fractions');
  });

  it('SEQ-2: should diagnose multiplication facts on L3 miss + L2 miss + two L1 misses', () => {
    const rng = createLcg(2);
    let state = startQuiz(QUESTION_BANK, rng);

    // Q1: L3 Medium -> Wrong
    expect(state.showStepBackBanner).toBe(false);
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Q2: L2 -> Wrong
    expect(state.showStepBackBanner).toBe(true);
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Q3: L1 -> Wrong
    expect(state.showStepBackBanner).toBe(true);
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Q4: L1 Confirmation -> Wrong
    expect(state.showStepBackBanner).toBe(false);
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Verdict check
    expect(state.screen).toBe('RESULT');
    expect(state.auditTrail.length).toBe(4);
    expect(state.result?.verdict).toBe(VERDICTS.MULTIPLICATION_FACTS);
    expect(state.result?.identifiedGap).toBe('multiplication_facts');
  });

  it('SEQ-3: should treat first L1 miss as slip when confirmed on second L1 question', () => {
    const rng = createLcg(3);
    let state = startQuiz(QUESTION_BANK, rng);

    // Q1: L3 Medium -> Wrong
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Q2: L2 -> Wrong
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Q3: L1 -> Wrong
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);
    expect(state.showStepBackBanner).toBe(false); // Confirmation check

    // Q4: L1 Confirmation -> Right
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    // Verdict check: Slip recovered -> gap is equivalent fractions
    expect(state.screen).toBe('RESULT');
    expect(state.auditTrail.length).toBe(4);
    expect(state.result?.verdict).toBe(VERDICTS.EQUIVALENT_FRACTIONS);
    expect(state.result?.identifiedGap).toBe('equivalent_fractions');
  });

  it('SEQ-4: should diagnose adding unlike fractions when L2 prerequisite is passed after L3 med miss', () => {
    const rng = createLcg(4);
    let state = startQuiz(QUESTION_BANK, rng);

    // Q1: L3 Medium -> Wrong
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Q2: L2 -> Right
    expect(state.showStepBackBanner).toBe(true);
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    // Verdict check: L2 passed directly -> gap is adding unlike fractions
    expect(state.screen).toBe('RESULT');
    expect(state.auditTrail.length).toBe(2);
    expect(state.result?.verdict).toBe(VERDICTS.UNLIKE_FRACTIONS);
    expect(state.result?.identifiedGap).toBe('unlike_fractions');
  });

  it('SEQ-5: should declare mastery when 3 consecutive L3 difficulties pass', () => {
    const rng = createLcg(5);
    let state = startQuiz(QUESTION_BANK, rng);

    // Q1: L3 Medium -> Right
    expect(state.showStepBackBanner).toBe(false);
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    // Q2: L3 Harder -> Right
    expect(state.showStepBackBanner).toBe(false);
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    // Q3: L3 Hardest -> Right
    expect(state.showStepBackBanner).toBe(false);
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    // Verdict check: Mastery
    expect(state.screen).toBe('RESULT');
    expect(state.auditTrail.length).toBe(3);
    expect(state.result?.verdict).toBe(VERDICTS.MASTERY);
    expect(state.result?.identifiedGap).toBe('none');
  });

  it('SEQ-6: should reset state cleanly to initial on resetQuiz', () => {
    const rng = createLcg(6);
    let state = startQuiz(QUESTION_BANK, rng);
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    const reset = resetQuiz(QUESTION_BANK, rng);
    expect(reset).toEqual(createInitialState());
  });

  it('SEQ-7: should execute longest path to exactly 6 questions without exceeding cap', () => {
    const rng = createLcg(7);
    let state = startQuiz(QUESTION_BANK, rng);

    // Q1: L3 Medium -> Right
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);
    expect(state.questionIndex).toBe(2);

    // Q2: L3 Harder -> Right
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);
    expect(state.questionIndex).toBe(3);

    // Q3: L3 Hardest -> Wrong (steps back to L2)
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);
    expect(state.questionIndex).toBe(4);
    expect(state.currentQuestion?.level).toBe(2);

    // Q4: L2 -> Wrong (steps back to L1)
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);
    expect(state.questionIndex).toBe(5);
    expect(state.currentQuestion?.level).toBe(1);

    // Q5: L1 -> Wrong (1st miss, slip check)
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);
    expect(state.questionIndex).toBe(6);
    expect(state.currentQuestion?.level).toBe(1);

    // Q6: L1 Confirmation -> Wrong
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Verdict check: exactly 6 questions
    expect(state.screen).toBe('RESULT');
    expect(state.auditTrail.length).toBe(6);
    expect(state.result?.verdict).toBe(VERDICTS.MULTIPLICATION_FACTS);
  });

  it('SEQ-8: should diagnose adding unlike fractions on L3 med pass + L3 hard miss + L2 pass', () => {
    const rng = createLcg(8);
    let state = startQuiz(QUESTION_BANK, rng);

    // Q1: L3 Med -> Right
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    // Q2: L3 Hard -> Wrong
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Q3: L2 -> Right
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    expect(state.screen).toBe('RESULT');
    expect(state.auditTrail.length).toBe(3);
    expect(state.result?.verdict).toBe(VERDICTS.UNLIKE_FRACTIONS);
  });

  it('SEQ-9: should diagnose adding unlike fractions on L3 med pass + L3 hard pass + L3 hardest miss + L2 pass', () => {
    const rng = createLcg(9);
    let state = startQuiz(QUESTION_BANK, rng);

    // Q1: L3 Med -> Right
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    // Q2: L3 Hard -> Right
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    // Q3: L3 Hardest -> Wrong
    state = submitAnswer(state, answerWrongly(state), QUESTION_BANK, rng);

    // Q4: L2 -> Right
    state = submitAnswer(state, answerCorrectly(state), QUESTION_BANK, rng);

    expect(state.screen).toBe('RESULT');
    expect(state.auditTrail.length).toBe(4);
    expect(state.result?.verdict).toBe(VERDICTS.UNLIKE_FRACTIONS);
  });
});
