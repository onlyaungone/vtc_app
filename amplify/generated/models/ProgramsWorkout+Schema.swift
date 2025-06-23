// swiftlint:disable all
import Amplify
import Foundation

extension ProgramsWorkout {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case programs
    case workout
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let programsWorkout = ProgramsWorkout.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "ProgramsWorkouts"
    model.syncPluralName = "ProgramsWorkouts"
    
    model.attributes(
      .index(fields: ["programsId"], name: "byPrograms"),
      .index(fields: ["workoutId"], name: "byWorkout"),
      .primaryKey(fields: [programsWorkout.id])
    )
    
    model.fields(
      .field(programsWorkout.id, is: .required, ofType: .string),
      .belongsTo(programsWorkout.programs, is: .required, ofType: Programs.self, targetNames: ["programsId"]),
      .belongsTo(programsWorkout.workout, is: .required, ofType: Workout.self, targetNames: ["workoutId"]),
      .field(programsWorkout.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(programsWorkout.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension ProgramsWorkout: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}