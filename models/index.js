// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Availability = {
  "MONDAY": "MONDAY",
  "TUESDAY": "TUESDAY",
  "WEDNESDAY": "WEDNESDAY",
  "THURSDAY": "THURSDAY",
  "FRIDAY": "FRIDAY",
  "SATURDAY": "SATURDAY",
  "SUNDAY": "SUNDAY"
};

const Niche = {
  "BODYBUILDING": "BODYBUILDING",
  "POWERLIFTING": "POWERLIFTING",
  "WEIGHTLOSS": "WEIGHTLOSS",
  "METCON": "METCON",
  "FUNCTIONALFITNESS": "FUNCTIONALFITNESS"
};

const Gender = {
  "MALE": "MALE",
  "FEMALE": "FEMALE",
  "OTHER": "OTHER"
};

const { TrainerActivityRecent, Programs, Match, ExerciseDetails, Workout, Exercises, InPersonClient, OnlineClient, PersonalTrainer, ProgramsWorkout, ProgramsInPersonClient, ProgramsOnlineClient, ExercisesWorkout } = initSchema(schema);

export {
  TrainerActivityRecent,
  Programs,
  Match,
  ExerciseDetails,
  Workout,
  Exercises,
  InPersonClient,
  OnlineClient,
  PersonalTrainer,
  ProgramsWorkout,
  ProgramsInPersonClient,
  ProgramsOnlineClient,
  ExercisesWorkout,
  Availability,
  Niche,
  Gender
};