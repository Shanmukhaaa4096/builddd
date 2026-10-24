import { Level, Question } from './question';

export type Screen = 'START' | 'QUESTION' | 'RESULT';

export interface AuditEntry {
  questionId: string;
  level: Level;
  prompt: string;
  selectedOptionText: string;
  wasCorrect: boolean;
  reason: string;
}

export type GapCategory =
  | 'none'
  | 'unlike_fractions'
  | 'equivalent_fractions'
  | 'multiplication_facts';

export interface QuizResult {
  verdict: string;
  identifiedGap: GapCategory;
  explanation: string;
  recommendation: string;
}

export interface EngineState {
  screen: Screen;
  currentQuestion: Question | null;
  questionIndex: number; // 1 to 6
  showStepBackBanner: boolean;
  stepBackMessage?: string;
  askedQuestionIds: string[];
  auditTrail: AuditEntry[];
  consecutiveL3Correct: number;
  l1MissCount: number;
  result: QuizResult | null;
}
