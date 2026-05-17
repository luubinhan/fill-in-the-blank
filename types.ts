export interface Sentence {
  english: string;
  translation: string;
  vietnamese?: string;
}

export type GameMode = 'flashcards' | 'fill-blank';

export type ViewState = 'levels' | 'speaking' | 'game';

export type LevelMode = 'vocabulary' | 'flashcards' | 'fill-blank';

export interface Level {
  name: string;
  description: string;
  mode: LevelMode;
  sentences: Sentence[];
}

export interface ProgressStats {
  remembered: number;
  needsReview: number;
  total: number;
}

export type LevelSelectionCounters = Record<string, number>;