import { Level } from '../types';
import { Tourism } from './speaking/tourism';
import { Family } from './speaking/family';
import { LearnMost } from './speaking/most';
import { PlaceToLive } from './speaking/place-to-live';
import { TimeOfTheYear } from './speaking/time-of-the-year';

export const SPEAKING_LEVELS: Level[] = [
  Tourism,
  Family,
  LearnMost,
  PlaceToLive,
  TimeOfTheYear,
];
