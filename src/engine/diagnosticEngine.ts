import { Question, Level, Difficulty } from '../types/question';
import { EngineState, QuizResult, AuditEntry } from '../types/engine';

export const VERDICTS = {
  MASTERY: "No foundational gap found, you're ready for unlike fractions!",
  UNLIKE_FRACTIONS: 'Your gap is adding unlike fractions.',
  EQUIVALENT_FRACTIONS: 'Your gap is equivalent fractions.',
  MULTIPLICATION_FACTS: 'Your gap is multiplication facts.',
} as const;

export function createInitialState(): EngineState {
  return {
    screen: 'START',
    currentQuestion: null,
    questionIndex: 0,
    showStepBackBanner: false,
    stepBackMessage: undefined,
    askedQuestionIds: [],
    auditTrail: [],
    consecutiveL3Correct: 0,
    l1MissCount: 0,
    result: null,
  };
}

export function shuffleOptions(question: Question, rng: () => number): Question {
  const options = question.options.map(o => ({
    ...o,
    isCorrect: o.value === question.correctValue,
  }));

  // Pure Fisher-Yates shuffle using injected rng
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = options[i];
    options[i] = options[j];
    options[j] = temp;
  }

  return { ...question, options };
}

export function selectQuestion(
  level: Level,
  difficulty: Difficulty | undefined,
  askedIds: string[],
  bank: Question[],
  rng: () => number
): Question {
  let available = bank.filter(
    q => q.level === level && (!difficulty || q.difficulty === difficulty) && !askedIds.includes(q.id)
  );

  // If specific difficulty exhausted at level 3, fall back to any unasked level 3
  if (available.length === 0 && level === 3) {
    available = bank.filter(q => q.level === 3 && !askedIds.includes(q.id));
  }

  // Safety fallback if level exhausted
  if (available.length === 0) {
    available = bank.filter(q => !askedIds.includes(q.id));
  }

  if (available.length === 0) {
    throw new Error('Question bank exhausted');
  }

  // Sort deterministically before picking
  available.sort((a, b) => a.id.localeCompare(b.id));
  const picked = available[Math.floor(rng() * available.length)];
  return shuffleOptions(picked, rng);
}

export function startQuiz(questionBank: Question[], rng: () => number): EngineState {
  const firstQuestion = selectQuestion(3, 'medium', [], questionBank, rng);
  return {
    screen: 'QUESTION',
    currentQuestion: firstQuestion,
    questionIndex: 1,
    showStepBackBanner: false,
    stepBackMessage: undefined,
    askedQuestionIds: [firstQuestion.id],
    auditTrail: [],
    consecutiveL3Correct: 0,
    l1MissCount: 0,
    result: null,
  };
}

export function resetQuiz(_questionBank?: Question[], _rng?: () => number): EngineState {
  return createInitialState();
}

function buildResult(
  verdict: string,
  identifiedGap: QuizResult['identifiedGap']
): QuizResult {
  switch (identifiedGap) {
    case 'none':
      return {
        verdict,
        identifiedGap,
        explanation: 'You successfully solved adding unlike fractions across all difficulty tiers.',
        recommendation: 'Continue challenging yourself with mixed numbers and multi-step fraction word problems!',
      };
    case 'unlike_fractions':
      return {
        verdict,
        identifiedGap,
        explanation: 'You understand equivalent fractions and multiplication facts, but struggle when finding common denominators.',
        recommendation: 'Practice finding common denominators and renaming fractions before adding.',
      };
    case 'equivalent_fractions':
      return {
        verdict,
        identifiedGap,
        explanation: 'You know your basic multiplication facts, but need practice recognizing when two fractions represent the same amount.',
        recommendation: 'Practice multiplying the numerator and denominator by the same number to generate equivalent fractions.',
      };
    case 'multiplication_facts':
      return {
        verdict,
        identifiedGap,
        explanation: 'Errors in fractions often trace back to foundational multiplication recall.',
        recommendation: 'Focus on quick recall of single-digit multiplication tables (e.g. 3×, 4×, 6×, 7× tables).',
      };
  }
}

export function submitAnswer(
  currentState: EngineState,
  selectedOptionId: string,
  questionBank: Question[],
  rng: () => number
): EngineState {
  const currentQ = currentState.currentQuestion;
  if (!currentQ || currentState.screen !== 'QUESTION') {
    return currentState;
  }

  const selectedOption = currentQ.options.find(o => o.id === selectedOptionId);
  const wasCorrect = selectedOption ? selectedOption.isCorrect : false;
  const selectedText = selectedOption ? selectedOption.text : 'Unknown';

  let auditReason = '';
  if (currentQ.level === 3) {
    auditReason = wasCorrect
      ? 'Level 3 mastered; advanced difficulty.'
      : 'Level 3 error; stepping back to check Equivalent Fractions.';
  } else if (currentQ.level === 2) {
    auditReason = wasCorrect
      ? 'Level 2 prerequisite passed; gap is in adding unlike fractions.'
      : 'Level 2 error; stepping back to check Multiplication Facts.';
  } else if (currentQ.level === 1) {
    if (currentState.l1MissCount === 0 && !wasCorrect) {
      auditReason = 'Level 1 missed once; presenting confirmation question (slip check).';
    } else if (wasCorrect) {
      auditReason = 'Level 1 multiplication passed; gap is in Equivalent Fractions.';
    } else {
      auditReason = 'Level 1 multiplication confirmed missed; gap is Multiplication Facts.';
    }
  }

  const newAuditEntry: AuditEntry = {
    questionId: currentQ.id,
    level: currentQ.level,
    prompt: currentQ.prompt,
    selectedOptionText: selectedText,
    wasCorrect,
    reason: auditReason,
  };

  const newAuditTrail = [...currentState.auditTrail, newAuditEntry];
  const newQuestionIndex = currentState.questionIndex + 1;

  // --- Evaluate State Transition ---

  // LEVEL 3
  if (currentQ.level === 3) {
    if (wasCorrect) {
      const nextConsecutive = currentState.consecutiveL3Correct + 1;
      if (nextConsecutive === 3) {
        // Mastery reached
        return {
          ...currentState,
          screen: 'RESULT',
          currentQuestion: null,
          auditTrail: newAuditTrail,
          consecutiveL3Correct: nextConsecutive,
          showStepBackBanner: false,
          result: buildResult(VERDICTS.MASTERY, 'none'),
        };
      }

      // Next L3 question
      const nextDiff: Difficulty = nextConsecutive === 1 ? 'harder' : 'hardest';
      const nextQ = selectQuestion(3, nextDiff, currentState.askedQuestionIds, questionBank, rng);
      return {
        ...currentState,
        currentQuestion: nextQ,
        questionIndex: newQuestionIndex,
        askedQuestionIds: [...currentState.askedQuestionIds, nextQ.id],
        auditTrail: newAuditTrail,
        consecutiveL3Correct: nextConsecutive,
        showStepBackBanner: false,
      };
    } else {
      // L3 miss -> step back to Level 2
      const nextQ = selectQuestion(2, undefined, currentState.askedQuestionIds, questionBank, rng);
      return {
        ...currentState,
        currentQuestion: nextQ,
        questionIndex: newQuestionIndex,
        askedQuestionIds: [...currentState.askedQuestionIds, nextQ.id],
        auditTrail: newAuditTrail,
        consecutiveL3Correct: 0,
        showStepBackBanner: true,
        stepBackMessage: "Let's step back and check prerequisite: Equivalent Fractions.",
      };
    }
  }

  // LEVEL 2
  if (currentQ.level === 2) {
    if (wasCorrect) {
      // L2 passed -> Gap is adding unlike fractions
      return {
        ...currentState,
        screen: 'RESULT',
        currentQuestion: null,
        auditTrail: newAuditTrail,
        showStepBackBanner: false,
        result: buildResult(VERDICTS.UNLIKE_FRACTIONS, 'unlike_fractions'),
      };
    } else {
      // L2 miss -> step back to Level 1
      const nextQ = selectQuestion(1, undefined, currentState.askedQuestionIds, questionBank, rng);
      return {
        ...currentState,
        currentQuestion: nextQ,
        questionIndex: newQuestionIndex,
        askedQuestionIds: [...currentState.askedQuestionIds, nextQ.id],
        auditTrail: newAuditTrail,
        showStepBackBanner: true,
        stepBackMessage: "Let's step back and check prerequisite: Multiplication Facts.",
      };
    }
  }

  // LEVEL 1
  if (currentQ.level === 1) {
    if (wasCorrect) {
      // L1 passed -> Gap is equivalent fractions
      return {
        ...currentState,
        screen: 'RESULT',
        currentQuestion: null,
        auditTrail: newAuditTrail,
        showStepBackBanner: false,
        result: buildResult(VERDICTS.EQUIVALENT_FRACTIONS, 'equivalent_fractions'),
      };
    } else {
      // L1 missed
      if (currentState.l1MissCount === 0) {
        // First miss -> Slip check (ask L1 confirmation Q2)
        const nextQ = selectQuestion(1, undefined, currentState.askedQuestionIds, questionBank, rng);
        return {
          ...currentState,
          currentQuestion: nextQ,
          questionIndex: newQuestionIndex,
          askedQuestionIds: [...currentState.askedQuestionIds, nextQ.id],
          auditTrail: newAuditTrail,
          l1MissCount: 1,
          showStepBackBanner: false, // Confirmation check is NOT a step-back banner
        };
      } else {
        // Second miss -> Gap is multiplication facts
        return {
          ...currentState,
          screen: 'RESULT',
          currentQuestion: null,
          auditTrail: newAuditTrail,
          l1MissCount: 2,
          showStepBackBanner: false,
          result: buildResult(VERDICTS.MULTIPLICATION_FACTS, 'multiplication_facts'),
        };
      }
    }
  }

  // Check 6-Question Cap fallback (if reached 6 answered questions and still in question screen)
  if (newAuditTrail.length >= 6) {
    // Determine lowest unmastered concept
    const hadL1Miss = newAuditTrail.some(a => a.level === 1 && !a.wasCorrect);
    const hadL2Miss = newAuditTrail.some(a => a.level === 2 && !a.wasCorrect);
    if (hadL1Miss) {
      return {
        ...currentState,
        screen: 'RESULT',
        currentQuestion: null,
        auditTrail: newAuditTrail,
        showStepBackBanner: false,
        result: buildResult(VERDICTS.MULTIPLICATION_FACTS, 'multiplication_facts'),
      };
    } else if (hadL2Miss) {
      return {
        ...currentState,
        screen: 'RESULT',
        currentQuestion: null,
        auditTrail: newAuditTrail,
        showStepBackBanner: false,
        result: buildResult(VERDICTS.EQUIVALENT_FRACTIONS, 'equivalent_fractions'),
      };
    } else {
      return {
        ...currentState,
        screen: 'RESULT',
        currentQuestion: null,
        auditTrail: newAuditTrail,
        showStepBackBanner: false,
        result: buildResult(VERDICTS.UNLIKE_FRACTIONS, 'unlike_fractions'),
      };
    }
  }

  return currentState;
}
