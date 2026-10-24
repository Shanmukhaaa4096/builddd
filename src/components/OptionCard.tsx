import { Option } from '../types/question';

interface OptionCardProps {
  option: Option;
  isSelected: boolean;
  isLocked: boolean;
  hasSelection: boolean;
  onSelect: (optionId: string) => void;
}

export function OptionCard({
  option,
  isSelected,
  isLocked,
  hasSelection,
  onSelect,
}: OptionCardProps) {
  let btnClass = 'option-btn';

  if (isSelected) {
    btnClass += option.isCorrect ? ' selected-correct' : ' selected-wrong';
  } else if (hasSelection) {
    btnClass += ' dimmed';
  }

  return (
    <button
      type="button"
      className={btnClass}
      disabled={isLocked}
      onClick={() => onSelect(option.id)}
      aria-pressed={isSelected}
      data-testid={`option-${option.id}`}
      data-option-value={option.value}
    >
      <span>{option.text}</span>
      {isSelected && (
        <span className="option-feedback" aria-live="polite">
          {option.isCorrect ? (
            <>
              <span aria-hidden="true">✓</span> Correct!
            </>
          ) : (
            <>
              <span aria-hidden="true">✕</span> Not quite.
            </>
          )}
        </span>
      )}
    </button>
  );
}
