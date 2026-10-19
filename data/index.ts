import { Level } from '../types';
import { Mispronunciation } from './mispronunciation';
import { Vocabulary } from './vocabulary';
import { Mistake } from './mistake';
import { SentenceBuilder } from './sentence-builder';
import { PhrasalVerbs } from './phrasal-verbs';
import { MoneyMatters } from './money-matters';
import { Get } from './get';
import { DisagreeingPolitely } from './disagreeing-politely';
import { SmallTalk } from './small-talk';
import { DailyStandup } from './daily-standup';
import { VocabularyFood } from './vocabulary-food';
import { GrammarGuru } from './grammar-guru';
import { HowAreYou } from './how-are-you';
import { ConditionalStatements } from './if-condition';
import { Tired } from './tired';
import { SpeakingFramework } from './speaking-framework';
import { DavinciResolve } from './davinci-resolve';
import { Idioms } from './idioms';

export const LEVELS: Level[] = [
  SpeakingFramework,
  Tired,
  HowAreYou,
  Vocabulary,
  Mispronunciation,
  Mistake,
  PhrasalVerbs,
  SentenceBuilder,
  GrammarGuru,
  MoneyMatters,
  VocabularyFood,
  DailyStandup,
  SmallTalk,
  DisagreeingPolitely,
  ConditionalStatements,
  Get,
  DavinciResolve,
  Idioms,
];
