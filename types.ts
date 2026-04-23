export interface Sentence {
  english: string;
  translation: string;
  vietnamese?: string;
}

export type GameMode = 'flashcards' | 'fill-blank';

export type ViewState = 'levels' | 'game';

export interface Level {
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sentences: Sentence[];
}

export interface ProgressStats {
  remembered: number;
  needsReview: number;
  total: number;
}