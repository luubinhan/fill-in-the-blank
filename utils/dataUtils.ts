import { Sentence } from '../types';

/**
 * Shuffles sentences and returns a subset
 */
export const prepareGameData = (sentences: Sentence[], count: number = 7): Sentence[] => {
  return [...sentences].sort(() => Math.random() - 0.5).slice(0, count);
};

/**
 * Filters words that are suitable for hiding (longer than 1 letter)
 */
export const getSelectableWords = (sentence: string): Array<{ word: string; index: number }> => {
  const words = sentence.split(' ');
  return words
    .map((word, index) => ({ word, index }))
    .filter(item => item.word.replace(/[^a-zA-Z]/g, '').length > 1);
};

/**
 * Removes punctuation from a word for comparison
 */
export const stripPunctuation = (word: string): string => {
  return word.replace(/[.,!?;:"']/g, '');
};
