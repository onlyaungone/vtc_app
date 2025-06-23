// swiftlint:disable all
import Amplify
import Foundation

extension Workout {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case name
    case exercisess
    case userSubId
    case programss
    case isComplete
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let workout = Workout.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "Workouts"
    model.syncPluralName = "Workouts"
    
    model.attributes(
      .primaryKey(fields: [workout.id])
    )
    
    model.fields(
      .field(workout.id, is: .required, ofType: .string),
      .field(workout.name, is: .required, ofType: .string),
      .hasMany(workout.exercisess, is: .optional, ofType: ExercisesWorkout.self, associatedWith: ExercisesWorkout.keys.workout),
      .field(workout.userSubId, is: .required, ofType: .string),
      .hasMany(workout.programss, is: .optional, ofType: ProgramsWorkout.self, associatedWith: ProgramsWorkout.keys.workout),
      .field(workout.isComplete, is: .required, ofType: .bool),
      .field(workout.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(workout.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension Workout: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}