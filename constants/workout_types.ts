export interface Exercise {
    id: string;
    name: string;
    targetMuscle: string;
    equipment: string;
    secondaryMuscles: string[];
    instruction: string[];
    image: any;
  }
  
  export interface WorkoutItem {
    id: string;
    name: string;
    image?: any;
    exercises?: number;
    exerciseIds?: string[];
    workoutExerciseIds?: string[];
  }
  
  export interface ExerciseSet {
    id: string;
    name: string;
    set: string;
    load: string;
    reps: string;
    rest: string;
    variable: string;
    image: any;
    workoutExerciseId: string;
  }
  
  export interface ExerciseName {
    id: string;
    name: string;
    image: any;
  }
  
  export interface ExerciseDetail {
    id: string;
    name: string;
    set: string;
    load: string;
    reps: string;
    rest: string;
    variable: string;
    image: any;
    workoutExerciseId: string;
  }
  
  export interface ExerciseInfo {
    id: string;
    name: string;
    image: any;
  }
  
  export interface SetInfo {
    set: string;
    load: string;
    reps: string;
    variable: string;
    rest: string;
  }
  
  export interface ExerciseWithSets extends Exercise {
    sets: SetInfo[];
  }
  