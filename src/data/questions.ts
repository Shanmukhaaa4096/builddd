import { Question } from '../types/question';

export const QUESTION_BANK: Question[] = [
  // --- LEVEL 3: Adding Unlike Fractions (4 questions) ---
  {
    id: 'q-l3-1',
    level: 3,
    difficulty: 'medium',
    prompt: 'What is 1/2 + 1/4?',
    concept: 'Adding unlike fractions where one denominator is a multiple of the other',
    correctValue: '3/4',
    options: [
      { id: 'q-l3-1-opt1', text: '3/4', value: '3/4', isCorrect: true },
      { id: 'q-l3-1-opt2', text: '2/6', value: '2/6', isCorrect: false },
      { id: 'q-l3-1-opt3', text: '2/4', value: '2/4', isCorrect: false },
      { id: 'q-l3-1-opt4', text: '1/3', value: '1/3', isCorrect: false },
    ],
  },
  {
    id: 'q-l3-2',
    level: 3,
    difficulty: 'harder',
    prompt: 'What is 1/2 + 1/3?',
    concept: 'Adding unlike fractions with coprime denominators',
    correctValue: '5/6',
    options: [
      { id: 'q-l3-2-opt1', text: '5/6', value: '5/6', isCorrect: true },
      { id: 'q-l3-2-opt2', text: '2/5', value: '2/5', isCorrect: false },
      { id: 'q-l3-2-opt3', text: '1/5', value: '1/5', isCorrect: false },
      { id: 'q-l3-2-opt4', text: '2/6', value: '2/6', isCorrect: false },
    ],
  },
  {
    id: 'q-l3-3',
    level: 3,
    difficulty: 'hardest',
    prompt: 'What is 2/3 + 3/5?',
    concept: 'Adding unlike fractions yielding improper fraction',
    correctValue: '19/15',
    options: [
      { id: 'q-l3-3-opt1', text: '19/15', value: '19/15', isCorrect: true },
      { id: 'q-l3-3-opt2', text: '5/8', value: '5/8', isCorrect: false },
      { id: 'q-l3-3-opt3', text: '6/15', value: '6/15', isCorrect: false },
      { id: 'q-l3-3-opt4', text: '11/15', value: '11/15', isCorrect: false },
    ],
  },
  {
    id: 'q-l3-4',
    level: 3,
    difficulty: 'medium',
    prompt: 'What is 1/4 + 1/8?',
    concept: 'Adding unlike fractions where 8 is a multiple of 4',
    correctValue: '3/8',
    options: [
      { id: 'q-l3-4-opt1', text: '3/8', value: '3/8', isCorrect: true },
      { id: 'q-l3-4-opt2', text: '1/4', value: '1/4', isCorrect: false },
      { id: 'q-l3-4-opt3', text: '1/2', value: '1/2', isCorrect: false },
      { id: 'q-l3-4-opt4', text: '5/8', value: '5/8', isCorrect: false },
    ],
  },

  // --- LEVEL 2: Equivalent Fractions (4 questions) ---
  {
    id: 'q-l2-1',
    level: 2,
    prompt: 'Which fraction is equivalent to 1/2?',
    concept: 'Equivalent fractions for 1/2',
    correctValue: '2/4',
    options: [
      { id: 'q-l2-1-opt1', text: '2/4', value: '2/4', isCorrect: true },
      { id: 'q-l2-1-opt2', text: '2/3', value: '2/3', isCorrect: false },
      { id: 'q-l2-1-opt3', text: '1/3', value: '1/3', isCorrect: false },
      { id: 'q-l2-1-opt4', text: '2/5', value: '2/5', isCorrect: false },
    ],
  },
  {
    id: 'q-l2-2',
    level: 2,
    prompt: 'Which fraction is equivalent to 2/3?',
    concept: 'Equivalent fractions for 2/3',
    correctValue: '4/6',
    options: [
      { id: 'q-l2-2-opt1', text: '4/6', value: '4/6', isCorrect: true },
      { id: 'q-l2-2-opt2', text: '3/4', value: '3/4', isCorrect: false },
      { id: 'q-l2-2-opt3', text: '2/6', value: '2/6', isCorrect: false },
      { id: 'q-l2-2-opt4', text: '4/9', value: '4/9', isCorrect: false },
    ],
  },
  {
    id: 'q-l2-3',
    level: 2,
    prompt: 'Which fraction is equivalent to 3/4?',
    concept: 'Equivalent fractions for 3/4',
    correctValue: '6/8',
    options: [
      { id: 'q-l2-3-opt1', text: '6/8', value: '6/8', isCorrect: true },
      { id: 'q-l2-3-opt2', text: '3/8', value: '3/8', isCorrect: false },
      { id: 'q-l2-3-opt3', text: '6/12', value: '6/12', isCorrect: false },
      { id: 'q-l2-3-opt4', text: '5/8', value: '5/8', isCorrect: false },
    ],
  },
  {
    id: 'q-l2-4',
    level: 2,
    prompt: 'Which fraction is equivalent to 3/5?',
    concept: 'Equivalent fractions for 3/5',
    correctValue: '6/10',
    options: [
      { id: 'q-l2-4-opt1', text: '6/10', value: '6/10', isCorrect: true },
      { id: 'q-l2-4-opt2', text: '4/5', value: '4/5', isCorrect: false },
      { id: 'q-l2-4-opt3', text: '6/15', value: '6/15', isCorrect: false },
      { id: 'q-l2-4-opt4', text: '3/10', value: '3/10', isCorrect: false },
    ],
  },

  // --- LEVEL 1: Multiplication Facts (4 questions with distinct products) ---
  {
    id: 'q-l1-1',
    level: 1,
    prompt: 'What is 3 × 4?',
    concept: 'Multiplication fact: 3 times 4',
    correctValue: '12',
    options: [
      { id: 'q-l1-1-opt1', text: '12', value: '12', isCorrect: true },
      { id: 'q-l1-1-opt2', text: '7', value: '7', isCorrect: false },
      { id: 'q-l1-1-opt3', text: '10', value: '10', isCorrect: false },
      { id: 'q-l1-1-opt4', text: '14', value: '14', isCorrect: false },
    ],
  },
  {
    id: 'q-l1-2',
    level: 1,
    prompt: 'What is 7 × 6?',
    concept: 'Multiplication fact: 7 times 6',
    correctValue: '42',
    options: [
      { id: 'q-l1-2-opt1', text: '42', value: '42', isCorrect: true },
      { id: 'q-l1-2-opt2', text: '36', value: '36', isCorrect: false },
      { id: 'q-l1-2-opt3', text: '48', value: '48', isCorrect: false },
      { id: 'q-l1-2-opt4', text: '13', value: '13', isCorrect: false },
    ],
  },
  {
    id: 'q-l1-3',
    level: 1,
    prompt: 'What is 4 × 5?',
    concept: 'Multiplication fact: 4 times 5',
    correctValue: '20',
    options: [
      { id: 'q-l1-3-opt1', text: '20', value: '20', isCorrect: true },
      { id: 'q-l1-3-opt2', text: '15', value: '15', isCorrect: false },
      { id: 'q-l1-3-opt3', text: '24', value: '24', isCorrect: false },
      { id: 'q-l1-3-opt4', text: '25', value: '25', isCorrect: false },
    ],
  },
  {
    id: 'q-l1-4',
    level: 1,
    prompt: 'What is 6 × 6?',
    concept: 'Multiplication fact: 6 times 6',
    correctValue: '36',
    options: [
      { id: 'q-l1-4-opt1', text: '36', value: '36', isCorrect: true },
      { id: 'q-l1-4-opt2', text: '30', value: '30', isCorrect: false },
      { id: 'q-l1-4-opt3', text: '42', value: '42', isCorrect: false },
      { id: 'q-l1-4-opt4', text: '12', value: '12', isCorrect: false },
    ],
  },
];
