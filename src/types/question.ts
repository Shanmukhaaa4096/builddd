export type Level = 1 | 2 | 3;

export type Difficulty = 'medium' | 'harder' | 'hardest';

export interface Option {
  id: string;
  text: string;
  value: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  level: Level;
  difficulty?: Difficulty;
  prompt: string;
  concept: string;
  correctValue: string;
  options: Option[];
}
