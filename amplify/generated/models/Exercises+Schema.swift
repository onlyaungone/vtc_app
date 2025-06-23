// swiftlint:disable all
import Amplify
import Foundation

extension Exercises {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case bodyPart
    case equipment
    case instructions
    case name
    case secondaryMuscles
    case target
    case Workouts
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let exercises = Exercises.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "Exercises"
    model.syncPluralName = "Exercises"
    
    model.attributes(
      .primaryKey(fields: [exercises.id])
    )
    
    model.fields(
      .field(exercises.id, is: .required, ofType: .string),
      .field(exercises.bodyPart, is: .optional, ofType: .string),
      .field(exercises.equipment, is: .optional, ofType: .string),
      .field(exercises.instructions, is: .optional, ofType: .embeddedCollection(of: String.self)),
      .field(exercises.name, is: .optional, ofType: .string),
      .field(exercises.secondaryMuscles, is: .optional, ofType: .embeddedCollection(of: String.self)),
      .field(exercises.target, is: .optional, ofType: .string),
      .hasMany(exercises.Workouts, is: .optional, ofType: ExercisesWorkout.self, associatedWith: ExercisesWorkout.keys.exercises),
      .field(exercises.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(exercises.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension Exercises: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}