import { useState } from 'react';
import './index.css';
import { QUESTION_BANK } from './data/questions';
import {
  createInitialState,
  startQuiz,
  submitAnswer,
  resetQuiz,
} from './engine/diagnosticEngine';
import { EngineState } from './types/engine';
import { StartView } from './components/StartView';
import { QuestionView } from './components/QuestionView';
import { ResultView } from './components/ResultView';

export function App() {
  const [engineState, setEngineState] = useState<EngineState>(createInitialState);

  const handleStart = () => {
    setEngineState(startQuiz(QUESTION_BANK, Math.random));
  };

  const handleNext = (selectedOptionId: string) => {
    setEngineState(prevState =>
      submitAnswer(prevState, selectedOptionId, QUESTION_BANK, Math.random)
    );
  };

  const handleRestart = () => {
    setEngineState(resetQuiz(QUESTION_BANK, Math.random));
  };

  return (
    <main>
      {engineState.screen === 'START' && <StartView onStart={handleStart} />}
      {engineState.screen === 'QUESTION' && (
        <QuestionView state={engineState} onNext={handleNext} />
      )}
      {engineState.screen === 'RESULT' && engineState.result && (
        <ResultView
          result={engineState.result}
          auditTrail={engineState.auditTrail}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
