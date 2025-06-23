import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

export enum Availability {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY"
}

export enum Niche {
  BODYBUILDING = "BODYBUILDING",
  POWERLIFTING = "POWERLIFTING",
  WEIGHTLOSS = "WEIGHTLOSS",
  METCON = "METCON",
  FUNCTIONALFITNESS = "FUNCTIONALFITNESS"
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}



type EagerTrainerActivityRecent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TrainerActivityRecent, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userSubId: string;
  readonly activity?: string | null;
  readonly timestamp?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTrainerActivityRecent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TrainerActivityRecent, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userSubId: string;
  readonly activity?: string | null;
  readonly timestamp?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type TrainerActivityRecent = LazyLoading extends LazyLoadingDisabled ? EagerTrainerActivityRecent : LazyTrainerActivityRecent

export declare const TrainerActivityRecent: (new (init: ModelInit<TrainerActivityRecent>) => TrainerActivityRecent) & {
  copyOf(source: TrainerActivityRecent, mutator: (draft: MutableModel<TrainerActivityRecent>) => MutableModel<TrainerActivityRecent> | void): TrainerActivityRecent;
}

type EagerPrograms = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Programs, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly userSubId?: string | null;
  readonly ProgramWorkout?: (ProgramsWorkout | null)[] | null;
  readonly InPersonClients?: (ProgramsInPersonClient | null)[] | null;
  readonly OnlineClients?: (ProgramsOnlineClient | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPrograms = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Programs, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly userSubId?: string | null;
  readonly ProgramWorkout: AsyncCollection<ProgramsWorkout>;
  readonly InPersonClients: AsyncCollection<ProgramsInPersonClient>;
  readonly OnlineClients: AsyncCollection<ProgramsOnlineClient>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Programs = LazyLoading extends LazyLoadingDisabled ? EagerPrograms : LazyPrograms

export declare const Programs: (new (init: ModelInit<Programs>) => Programs) & {
  copyOf(source: Programs, mutator: (draft: MutableModel<Programs>) => MutableModel<Programs> | void): Programs;
}

type EagerMatch = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Match, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly status?: string | null;
  readonly personaltrainerID: string;
  readonly inpersonclientID?: string | null;
  readonly onlineclientID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMatch = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Match, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly status?: string | null;
  readonly personaltrainerID: string;
  readonly inpersonclientID?: string | null;
  readonly onlineclientID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Match = LazyLoading extends LazyLoadingDisabled ? EagerMatch : LazyMatch

export declare const Match: (new (init: ModelInit<Match>) => Match) & {
  copyOf(source: Match, mutator: (draft: MutableModel<Match>) => MutableModel<Match> | void): Match;
}

type EagerExerciseDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ExerciseDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly load?: string | null;
  readonly reps?: string | null;
  readonly weightKGS?: string | null;
  readonly weightLBS?: string | null;
  readonly time?: string | null;
  readonly bodyweight?: string | null;
  readonly plateLevel?: string | null;
  readonly rpe?: string | null;
  readonly repRange?: string | null;
  readonly asManyRepsAsPossible?: string | null;
  readonly tempo?: string | null;
  readonly rest?: string | null;
  readonly workoutExerciseId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyExerciseDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ExerciseDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly load?: string | null;
  readonly reps?: string | null;
  readonly weightKGS?: string | null;
  readonly weightLBS?: string | null;
  readonly time?: string | null;
  readonly bodyweight?: string | null;
  readonly plateLevel?: string | null;
  readonly rpe?: string | null;
  readonly repRange?: string | null;
  readonly asManyRepsAsPossible?: string | null;
  readonly tempo?: string | null;
  readonly rest?: string | null;
  readonly workoutExerciseId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ExerciseDetails = LazyLoading extends LazyLoadingDisabled ? EagerExerciseDetails : LazyExerciseDetails

export declare const ExerciseDetails: (new (init: ModelInit<ExerciseDetails>) => ExerciseDetails) & {
  copyOf(source: ExerciseDetails, mutator: (draft: MutableModel<ExerciseDetails>) => MutableModel<ExerciseDetails> | void): ExerciseDetails;
}

type EagerWorkout = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Workout, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly exercisess?: (ExercisesWorkout | null)[] | null;
  readonly userSubId: string;
  readonly programss?: (ProgramsWorkout | null)[] | null;
  readonly isComplete: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyWorkout = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Workout, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly exercisess: AsyncCollection<ExercisesWorkout>;
  readonly userSubId: string;
  readonly programss: AsyncCollection<ProgramsWorkout>;
  readonly isComplete: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Workout = LazyLoading extends LazyLoadingDisabled ? EagerWorkout : LazyWorkout

export declare const Workout: (new (init: ModelInit<Workout>) => Workout) & {
  copyOf(source: Workout, mutator: (draft: MutableModel<Workout>) => MutableModel<Workout> | void): Workout;
}

type EagerExercises = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Exercises, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly bodyPart?: string | null;
  readonly equipment?: string | null;
  readonly instructions?: (string | null)[] | null;
  readonly name?: string | null;
  readonly secondaryMuscles?: (string | null)[] | null;
  readonly target?: string | null;
  readonly Workouts?: (ExercisesWorkout | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyExercises = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Exercises, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly bodyPart?: string | null;
  readonly equipment?: string | null;
  readonly instructions?: (string | null)[] | null;
  readonly name?: string | null;
  readonly secondaryMuscles?: (string | null)[] | null;
  readonly target?: string | null;
  readonly Workouts: AsyncCollection<ExercisesWorkout>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Exercises = LazyLoading extends LazyLoadingDisabled ? EagerExercises : LazyExercises

export declare const Exercises: (new (init: ModelInit<Exercises>) => Exercises) & {
  copyOf(source: Exercises, mutator: (draft: MutableModel<Exercises>) => MutableModel<Exercises> | void): Exercises;
}

type EagerInPersonClient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<InPersonClient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly gender?: Gender | keyof typeof Gender | null;
  readonly age?: number | null;
  readonly location?: string | null;
  readonly gymLocation?: string | null;
  readonly sub?: string | null;
  readonly Matches?: (Match | null)[] | null;
  readonly programss?: (ProgramsInPersonClient | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyInPersonClient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<InPersonClient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly gender?: Gender | keyof typeof Gender | null;
  readonly age?: number | null;
  readonly location?: string | null;
  readonly gymLocation?: string | null;
  readonly sub?: string | null;
  readonly Matches: AsyncCollection<Match>;
  readonly programss: AsyncCollection<ProgramsInPersonClient>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type InPersonClient = LazyLoading extends LazyLoadingDisabled ? EagerInPersonClient : LazyInPersonClient

export declare const InPersonClient: (new (init: ModelInit<InPersonClient>) => InPersonClient) & {
  copyOf(source: InPersonClient, mutator: (draft: MutableModel<InPersonClient>) => MutableModel<InPersonClient> | void): InPersonClient;
}

type EagerOnlineClient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OnlineClient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly age?: number | null;
  readonly gender: Gender | keyof typeof Gender;
  readonly trainerAge?: number | null;
  readonly trainerGender?: Gender | keyof typeof Gender | null;
  readonly niche?: Niche | keyof typeof Niche | null;
  readonly availability?: (Availability | null)[] | Array<keyof typeof Availability> | null;
  readonly trainerEducation?: string | null;
  readonly sub?: string | null;
  readonly Matches?: (Match | null)[] | null;
  readonly programss?: (ProgramsOnlineClient | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyOnlineClient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OnlineClient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly age?: number | null;
  readonly gender: Gender | keyof typeof Gender;
  readonly trainerAge?: number | null;
  readonly trainerGender?: Gender | keyof typeof Gender | null;
  readonly niche?: Niche | keyof typeof Niche | null;
  readonly availability?: (Availability | null)[] | Array<keyof typeof Availability> | null;
  readonly trainerEducation?: string | null;
  readonly sub?: string | null;
  readonly Matches: AsyncCollection<Match>;
  readonly programss: AsyncCollection<ProgramsOnlineClient>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type OnlineClient = LazyLoading extends LazyLoadingDisabled ? EagerOnlineClient : LazyOnlineClient

export declare const OnlineClient: (new (init: ModelInit<OnlineClient>) => OnlineClient) & {
  copyOf(source: OnlineClient, mutator: (draft: MutableModel<OnlineClient>) => MutableModel<OnlineClient> | void): OnlineClient;
}

type EagerPersonalTrainer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PersonalTrainer, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly education: string;
  readonly experience: number;
  readonly niche: Niche | keyof typeof Niche;
  readonly availability?: Availability[] | Array<keyof typeof Availability> | null;
  readonly location: string;
  readonly sub: string;
  readonly age: number;
  readonly gender: Gender | keyof typeof Gender;
  readonly bio?: string | null;
  readonly isApproved?: boolean | null;
  readonly image?: string | null;
  readonly gymLocation?: string | null;
  readonly Matches?: (Match | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPersonalTrainer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PersonalTrainer, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly education: string;
  readonly experience: number;
  readonly niche: Niche | keyof typeof Niche;
  readonly availability?: Availability[] | Array<keyof typeof Availability> | null;
  readonly location: string;
  readonly sub: string;
  readonly age: number;
  readonly gender: Gender | keyof typeof Gender;
  readonly bio?: string | null;
  readonly isApproved?: boolean | null;
  readonly image?: string | null;
  readonly gymLocation?: string | null;
  readonly Matches: AsyncCollection<Match>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PersonalTrainer = LazyLoading extends LazyLoadingDisabled ? EagerPersonalTrainer : LazyPersonalTrainer

export declare const PersonalTrainer: (new (init: ModelInit<PersonalTrainer>) => PersonalTrainer) & {
  copyOf(source: PersonalTrainer, mutator: (draft: MutableModel<PersonalTrainer>) => MutableModel<PersonalTrainer> | void): PersonalTrainer;
}

type EagerProgramsWorkout = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProgramsWorkout, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly programsId?: string | null;
  readonly workoutId?: string | null;
  readonly programs: Programs;
  readonly workout: Workout;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProgramsWorkout = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProgramsWorkout, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly programsId?: string | null;
  readonly workoutId?: string | null;
  readonly programs: AsyncItem<Programs>;
  readonly workout: AsyncItem<Workout>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ProgramsWorkout = LazyLoading extends LazyLoadingDisabled ? EagerProgramsWorkout : LazyProgramsWorkout

export declare const ProgramsWorkout: (new (init: ModelInit<ProgramsWorkout>) => ProgramsWorkout) & {
  copyOf(source: ProgramsWorkout, mutator: (draft: MutableModel<ProgramsWorkout>) => MutableModel<ProgramsWorkout> | void): ProgramsWorkout;
}

type EagerProgramsInPersonClient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProgramsInPersonClient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly programsId?: string | null;
  readonly inPersonClientId?: string | null;
  readonly programs: Programs;
  readonly inPersonClient: InPersonClient;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProgramsInPersonClient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProgramsInPersonClient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly programsId?: string | null;
  readonly inPersonClientId?: string | null;
  readonly programs: AsyncItem<Programs>;
  readonly inPersonClient: AsyncItem<InPersonClient>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ProgramsInPersonClient = LazyLoading extends LazyLoadingDisabled ? EagerProgramsInPersonClient : LazyProgramsInPersonClient

export declare const ProgramsInPersonClient: (new (init: ModelInit<ProgramsInPersonClient>) => ProgramsInPersonClient) & {
  copyOf(source: ProgramsInPersonClient, mutator: (draft: MutableModel<ProgramsInPersonClient>) => MutableModel<ProgramsInPersonClient> | void): ProgramsInPersonClient;
}

type EagerProgramsOnlineClient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProgramsOnlineClient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly programsId?: string | null;
  readonly onlineClientId?: string | null;
  readonly programs: Programs;
  readonly onlineClient: OnlineClient;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProgramsOnlineClient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProgramsOnlineClient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly programsId?: string | null;
  readonly onlineClientId?: string | null;
  readonly programs: AsyncItem<Programs>;
  readonly onlineClient: AsyncItem<OnlineClient>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ProgramsOnlineClient = LazyLoading extends LazyLoadingDisabled ? EagerProgramsOnlineClient : LazyProgramsOnlineClient

export declare const ProgramsOnlineClient: (new (init: ModelInit<ProgramsOnlineClient>) => ProgramsOnlineClient) & {
  copyOf(source: ProgramsOnlineClient, mutator: (draft: MutableModel<ProgramsOnlineClient>) => MutableModel<ProgramsOnlineClient> | void): ProgramsOnlineClient;
}

type EagerExercisesWorkout = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ExercisesWorkout, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly workoutId?: string | null;
  readonly exercisesId?: string | null;
  readonly workout: Workout;
  readonly exercises: Exercises;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyExercisesWorkout = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ExercisesWorkout, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly workoutId?: string | null;
  readonly exercisesId?: string | null;
  readonly workout: AsyncItem<Workout>;
  readonly exercises: AsyncItem<Exercises>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ExercisesWorkout = LazyLoading extends LazyLoadingDisabled ? EagerExercisesWorkout : LazyExercisesWorkout

export declare const ExercisesWorkout: (new (init: ModelInit<ExercisesWorkout>) => ExercisesWorkout) & {
  copyOf(source: ExercisesWorkout, mutator: (draft: MutableModel<ExercisesWorkout>) => MutableModel<ExercisesWorkout> | void): ExercisesWorkout;
}