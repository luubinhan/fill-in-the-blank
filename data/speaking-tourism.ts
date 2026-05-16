import { Level } from '../types';
import { Tourism } from './speaking/tourism';
import { Family } from './speaking/family';
import { LearnMost } from './speaking/most';
import { PlaceToLive } from './speaking/place-to-live';
import { TimeOfTheYear } from './speaking/time-of-the-year';
import { Risk } from './speaking/risk';
import { Introduce } from './speaking/introduce';
import { WorkingInTheOffice } from './speaking/working-in-the-office';
import { ProudProject } from './speaking/proud-project';
import { FlexibleRoutine } from './speaking/flexiable-routine';

export const SPEAKING_LEVELS: Level[] = [
  FlexibleRoutine,
  ProudProject,
  Risk,
  Introduce,
  Tourism,
  Family,
  LearnMost,
  PlaceToLive,
  TimeOfTheYear,
  WorkingInTheOffice
];
