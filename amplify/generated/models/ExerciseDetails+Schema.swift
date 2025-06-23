// swiftlint:disable all
import Amplify
import Foundation

extension ExerciseDetails {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case load
    case reps
    case weightKGS
    case weightLBS
    case time
    case bodyweight
    case plateLevel
    case rpe
    case repRange
    case asManyRepsAsPossible
    case tempo
    case rest
    case workoutExerciseId
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let exerciseDetails = ExerciseDetails.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "ExerciseDetails"
    model.syncPluralName = "ExerciseDetails"
    
    model.attributes(
      .primaryKey(fields: [exerciseDetails.id])
    )
    
    model.fields(
      .field(exerciseDetails.id, is: .required, ofType: .string),
      .field(exerciseDetails.load, is: .optional, ofType: .string),
      .field(exerciseDetails.reps, is: .optional, ofType: .string),
      .field(exerciseDetails.weightKGS, is: .optional, ofType: .string),
      .field(exerciseDetails.weightLBS, is: .optional, ofType: .string),
      .field(exerciseDetails.time, is: .optional, ofType: .time),
      .field(exerciseDetails.bodyweight, is: .optional, ofType: .string),
      .field(exerciseDetails.plateLevel, is: .optional, ofType: .string),
      .field(exerciseDetails.rpe, is: .optional, ofType: .string),
      .field(exerciseDetails.repRange, is: .optional, ofType: .string),
      .field(exerciseDetails.asManyRepsAsPossible, is: .optional, ofType: .string),
      .field(exerciseDetails.tempo, is: .optional, ofType: .string),
      .field(exerciseDetails.rest, is: .optional, ofType: .time),
      .field(exerciseDetails.workoutExerciseId, is: .required, ofType: .string),
      .field(exerciseDetails.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(exerciseDetails.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension ExerciseDetails: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}