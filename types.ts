export interface Sentence {
  id: string;
  english: string;
  translation: string; // Or explanation/hint
  difficulty?: 'easy' | 'medium' | 'hard';
}

export type GameMode = 'flashcards' | 'fill-blank' | 'menu';

export interface ProgressStats {
  remembered: number;
  needsReview: number;
  total: number;
}