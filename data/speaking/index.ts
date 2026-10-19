import { Level } from '../../types';
import { Tourism } from './tourism';
import { Family } from './family';
import { LearnMost } from './most';
import { PlaceToLive } from './place-to-live';
import { TimeOfTheYear } from './time-of-the-year';
import { Risk } from './risk';
import { Introduce } from './introduce';
import { WorkingInTheOffice } from './working-in-the-office';
import { ProudProject } from './proud-project';
import { FlexibleRoutine } from './flexiable-routine';
import { EnjoyUniversity } from './enjoy-university';
import { Hobbies } from './hobbies';
import { WorkingFromHome } from './working-from-home';
import { HomeRecharge } from './home-recharge';
import { SpendWeekends } from './weekends';
import { ConstrainProject } from './constrain-project';
import { DifficultFeedback } from './difficult-feedback';
import { AiProblem } from './ai-problem';
import { PromoteInternalStaff } from './promote-internal-staff';
import { AllowRemoteWork } from './allow-wfh';

export const SPEAKING_LEVELS: Level[] = [
  PromoteInternalStaff,
  AiProblem,
  DifficultFeedback,
  SpendWeekends,
  HomeRecharge,
  Hobbies,
  EnjoyUniversity,
  FlexibleRoutine,
  ProudProject,
  Risk,
  Introduce,
  Tourism,
  Family,
  LearnMost,
  PlaceToLive,
  TimeOfTheYear,
  WorkingInTheOffice,
  WorkingFromHome,
  AllowRemoteWork,
  ConstrainProject,
];
