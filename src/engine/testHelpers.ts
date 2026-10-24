import { EngineState } from '../types/engine';

export function answerCorrectly(state: EngineState): string {
  if (!state.currentQuestion) {
    throw new Error('No active question to answer');
  }
  const correct = state.currentQuestion.options.find(o => o.isCorrect);
  if (!correct) {
    throw new Error(`Question ${state.currentQuestion.id} has no correct option`);
  }
  return correct.id;
}

export function answerWrongly(state: EngineState): string {
  if (!state.currentQuestion) {
    throw new Error('No active question to answer');
  }
  const wrong = state.currentQuestion.options.find(o => !o.isCorrect);
  if (!wrong) {
    throw new Error(`Question ${state.currentQuestion.id} has no wrong options`);
  }
  return wrong.id;
}
