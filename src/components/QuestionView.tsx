import { useState } from 'react';
import { EngineState } from '../types/engine';
import { OptionCard } from './OptionCard';

interface QuestionViewProps {
  state: EngineState;
  onNext: (selectedOptionId: string) => void;
}

export function QuestionView({ state, onNext }: QuestionViewProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const q = state.currentQuestion;

  if (!q) {
    return null;
  }

  const handleSelectOption = (optionId: string) => {
    if (selectedOptionId !== null) return; // Prevent double-clicks
    setSelectedOptionId(optionId);
  };

  const handleNextClick = () => {
    if (!selectedOptionId) return;
    onNext(selectedOptionId);
    setSelectedOptionId(null);
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 3:
        return 'Level 3: Adding Unlike Fractions';
      case 2:
        return 'Prerequisite: Equivalent Fractions';
      case 1:
        return 'Prerequisite: Multiplication Facts';
      default:
        return `Level ${level}`;
    }
  };

  return (
    <div className="app-card">
      {/* Progress & Level Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="badge badge-level">{getLevelLabel(q.level)}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4A5568' }} data-testid="question-counter">
          Question {state.questionIndex} of max 6
        </span>
      </div>

      {/* Step-Back Prerequisite Banner */}
      {state.showStepBackBanner && (
        <div className="step-back-banner" data-testid="step-back-banner">
          <span aria-hidden="true">↩</span>
          <span>{state.stepBackMessage || "Let's step back and check prerequisite foundations."}</span>
        </div>
      )}

      {/* Question Prompt */}
      <div>
        <h2 style={{ fontSize: '1.4rem', marginTop: '0.25rem' }} data-testid="question-prompt">
          {q.prompt}
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.25rem' }}>{q.concept}</p>
      </div>

      {/* Options List */}
      <div className="options-grid">
        {q.options.map(option => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={selectedOptionId === option.id}
            isLocked={selectedOptionId !== null}
            hasSelection={selectedOptionId !== null}
            onSelect={handleSelectOption}
          />
        ))}
      </div>

      {/* Next Question CTA */}
      {selectedOptionId && (
        <button
          className="btn"
          onClick={handleNextClick}
          data-testid="next-btn"
          style={{ marginTop: '0.5rem' }}
        >
          Next Question
        </button>
      )}
    </div>
  );
}
