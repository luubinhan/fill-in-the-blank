export interface Sentence {
  id: string;
  english: string;
  translation: string; // Or explanation/hint
  difficulty?: 'easy' | 'medium' | 'hard';
}

export type GameMode = 'flashcards' | 'fill-blank';

export type ViewState = 'menu' | 'levels' | 'game';

export interface Level {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  color: string;
  accentColor: string;
  sentences: Sentence[];
}

export interface ProgressStats {
  remembered: number;
  needsReview: number;
  total: number;
}