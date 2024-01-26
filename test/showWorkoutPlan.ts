interface ExistingExercise {
  /**
   * ID of the existing exercise from exercises.json
   */
  id: string;
  /**
   * Number of sets for the existing exercise
   */
  sets: string;
  /**
   * Number of repetitions per set for the existing exercise
   */
  reps: string;
  [k: string]: unknown;
}
interface NewExercise {
  /**
   * Name of the new, custom exercise
   */
  name: string;
  /**
   * Detailed instructions on how to perform the new exercise
   */
  instructions: string[];
  /**
   * Primary muscles targeted by the new exercise
   */
  primaryMuscle?: string[];
  /**
   * Secondary muscles targeted by the new exercise
   */
  secondaryMuscle?: string[];
  /**
   * Type of force used in the new exercise
   */
  force?: string;
  /**
   * Difficulty level of the new exercise
   */
  level: string;
  /**
   * Category of the new exercise
   */
  category?: string;
  /**
   * Equipment required for the new exercise
   */
  equipment?: string;
  /**
   * Type of mechanics involved in the new exercise
   */
  mechanic?: string;
  /**
   * Number of sets for the new exercise
   */
  sets?: string;
  /**
   * Number of repetitions per set for the new exercise
   */
  reps: string;
  [k: string]: unknown;
}

interface Day {
  /**
   * A string containing the Day number of the plan
   */
  name: string;
  /**
   * What order is this day compared to other days, is this day 1 or day 2 or any other index of day in the plan
   */
  order: number;
  /**
   * What part of the body will be worked out on the day
   */
  tags: string[];
  exercises: (ExistingExercise | NewExercise)[];
}

export interface ShowWorkoutPlanParam {
  /**
   * The details of the plan, including days, exercises, and their order. It handles existing exercises by ID and new custom exercises with full details including primary and secondary muscles, force, level, category, equipment, and mechanics.
   */
  plan: {
    days?: Day[];
  };
}


/**
 * Retrieve the saved user information like age, height and weight 
 */
export function ShowWorkoutPlan(params: ShowWorkoutPlanParam) {
  
}
