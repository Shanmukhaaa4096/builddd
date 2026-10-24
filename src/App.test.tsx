import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './App';

describe('App End-to-End Component Integration', () => {
  it('UI-E2E: should render Start screen, advance through questions with locking, and show results', () => {
    render(<App />);

    // 1. Initial Start Screen
    expect(screen.getByText('ShikshaGap')).toBeInTheDocument();
    const startBtn = screen.getByTestId('start-btn');
    expect(startBtn).toBeInTheDocument();

    // 2. Start the Quiz
    fireEvent.click(startBtn);
    expect(screen.getByTestId('question-counter')).toHaveTextContent('Question 1 of max 6');

    // 3. Answer questions until Result screen
    // We click the first option on each question
    let safetyCounter = 0;
    while (!screen.queryByTestId('verdict-card') && safetyCounter < 10) {
      safetyCounter++;

      // Find all option buttons
      const optionButtons = screen.getAllByRole('button').filter(
        btn => btn.getAttribute('data-testid')?.startsWith('option-')
      );
      expect(optionButtons.length).toBe(4);

      // Verify buttons are not disabled before selection
      expect(optionButtons[0]).not.toBeDisabled();

      // Click first option
      fireEvent.click(optionButtons[0]);

      // Verify all buttons are now locked (disabled)
      optionButtons.forEach(btn => {
        expect(btn).toBeDisabled();
      });

      // Verify Next button appeared and click it
      const nextBtn = screen.getByTestId('next-btn');
      expect(nextBtn).toBeInTheDocument();
      fireEvent.click(nextBtn);
    }

    // 4. Verify Result Screen
    const verdictCard = screen.getByTestId('verdict-card');
    expect(verdictCard).toBeInTheDocument();
    const verdictText = screen.getByTestId('verdict-text');
    expect(verdictText.textContent).toBeTruthy();

    const restartBtn = screen.getByTestId('restart-btn');
    expect(restartBtn).toBeInTheDocument();

    // 5. Test Restart
    fireEvent.click(restartBtn);
    expect(screen.getByText('ShikshaGap')).toBeInTheDocument();
    expect(screen.getByTestId('start-btn')).toBeInTheDocument();
  });
});
