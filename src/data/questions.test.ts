import { describe, it, expect } from 'vitest';
import { QUESTION_BANK } from './questions';

describe('Question Bank Mathematical Data Validation', () => {
  it('DATA-VAL-1: should verify each question has exactly 1 correct option and correctValue matches option value', () => {
    for (const q of QUESTION_BANK) {
      const correctOptions = q.options.filter(o => o.isCorrect);
      expect(
        correctOptions.length,
        `Question ${q.id} must have exactly one correct option`
      ).toBe(1);

      expect(
        correctOptions[0].value,
        `Question ${q.id} correct option value must match q.correctValue`
      ).toBe(q.correctValue);

      expect(
        correctOptions[0].text,
        `Question ${q.id} correct option text must match q.correctValue`
      ).toBe(q.correctValue);
    }
  });

  it('DATA-VAL-2: should verify no duplicate options exist within any question', () => {
    for (const q of QUESTION_BANK) {
      expect(
        q.options.length,
        `Question ${q.id} must have exactly 4 options`
      ).toBe(4);

      const optionValues = q.options.map(o => o.value);
      const uniqueValues = new Set(optionValues);
      expect(
        uniqueValues.size,
        `Question ${q.id} must have 4 distinct option values`
      ).toBe(4);

      const optionTexts = q.options.map(o => o.text);
      const uniqueTexts = new Set(optionTexts);
      expect(
        uniqueTexts.size,
        `Question ${q.id} must have 4 distinct option texts`
      ).toBe(4);
    }
  });

  it('DATA-VAL-3: should verify stored answer values match real mathematical solutions', () => {
    // Helper to evaluate simple fraction strings "a/b" to floating point
    const evalFrac = (f: string): number => {
      const [num, den] = f.split('/').map(Number);
      return num / den;
    };

    for (const q of QUESTION_BANK) {
      if (q.level === 3) {
        // e.g. "What is 1/2 + 1/4?" -> extract "1/2" and "1/4"
        const match = q.prompt.match(/What is (\d+\/\d+) \+ (\d+\/\d+)\?/);
        expect(match, `Level 3 prompt "${q.prompt}" should match fraction addition format`).toBeTruthy();
        if (match) {
          const sum = evalFrac(match[1]) + evalFrac(match[2]);
          const stored = evalFrac(q.correctValue);
          expect(Math.abs(sum - stored)).toBeLessThan(1e-9);
        }
      } else if (q.level === 2) {
        // e.g. "Which fraction is equivalent to 1/2?"
        const match = q.prompt.match(/Which fraction is equivalent to (\d+\/\d+)\?/);
        expect(match, `Level 2 prompt "${q.prompt}" should match equivalent fraction format`).toBeTruthy();
        if (match) {
          const target = evalFrac(match[1]);
          const stored = evalFrac(q.correctValue);
          expect(Math.abs(target - stored)).toBeLessThan(1e-9);
        }
      } else if (q.level === 1) {
        // e.g. "What is 3 × 4?"
        const match = q.prompt.match(/What is (\d+) × (\d+)\?/);
        expect(match, `Level 1 prompt "${q.prompt}" should match multiplication format`).toBeTruthy();
        if (match) {
          const product = Number(match[1]) * Number(match[2]);
          const stored = Number(q.correctValue);
          expect(product).toBe(stored);
        }
      }
    }
  });

  it('DATA-VAL-4: should verify question bank has at least 4 questions per level and 12-15 total', () => {
    expect(QUESTION_BANK.length).toBeGreaterThanOrEqual(12);
    expect(QUESTION_BANK.length).toBeLessThanOrEqual(15);

    const l1 = QUESTION_BANK.filter(q => q.level === 1);
    const l2 = QUESTION_BANK.filter(q => q.level === 2);
    const l3 = QUESTION_BANK.filter(q => q.level === 3);

    expect(l1.length, 'Level 1 must have at least 4 questions').toBeGreaterThanOrEqual(4);
    expect(l2.length, 'Level 2 must have at least 4 questions').toBeGreaterThanOrEqual(4);
    expect(l3.length, 'Level 3 must have at least 4 questions').toBeGreaterThanOrEqual(4);
  });
});
