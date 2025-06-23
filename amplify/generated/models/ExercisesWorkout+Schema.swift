// swiftlint:disable all
import Amplify
import Foundation

extension ExercisesWorkout {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case workout
    case exercises
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let exercisesWorkout = ExercisesWorkout.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "ExercisesWorkouts"
    model.syncPluralName = "ExercisesWorkouts"
    
    model.attributes(
      .index(fields: ["workoutId"], name: "byWorkout"),
      .index(fields: ["exercisesId"], name: "byExercises"),
      .primaryKey(fields: [exercisesWorkout.id])
    )
    
    model.fields(
      .field(exercisesWorkout.id, is: .required, ofType: .string),
      .belongsTo(exercisesWorkout.workout, is: .required, ofType: Workout.self, targetNames: ["workoutId"]),
      .belongsTo(exercisesWorkout.exercises, is: .required, ofType: Exercises.self, targetNames: ["exercisesId"]),
      .field(exercisesWorkout.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(exercisesWorkout.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension ExercisesWorkout: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}