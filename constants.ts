import { Level } from './types';
import { Mispronunciation } from './data/mispronunciation';
import { Vocabulary } from './data/vocabulary';
import { Mistake } from './data/mistake';
import { SentenceBuilder } from './data/sentence-builder';
import { PhrasalVerbs } from './data/phrasal-verbs';
import { MoneyMatters } from './data/money-matters';
import { Get } from './data/get';
import { DisagreeingPolitely } from './data/disagreeing-politely';
import { SmallTalk } from './data/small-talk';
import { DailyStandup } from './data/daily-standup';
import { VocabularyFood } from './data/vocabulary-food';
import { GrammarGuru } from './data/grammar-guru';
import { HowAreYou } from './data/how-are-you';
import { ConditionalStatements } from './data/if-condition';
import { Tired } from './data/tired';
import { SpeakingFramework } from './data/speaking-framework';

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
];
