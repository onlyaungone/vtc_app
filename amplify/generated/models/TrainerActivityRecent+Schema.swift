// swiftlint:disable all
import Amplify
import Foundation

extension TrainerActivityRecent {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case userSubId
    case activity
    case timestamp
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let trainerActivityRecent = TrainerActivityRecent.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "TrainerActivityRecents"
    model.syncPluralName = "TrainerActivityRecents"
    
    model.attributes(
      .primaryKey(fields: [trainerActivityRecent.id])
    )
    
    model.fields(
      .field(trainerActivityRecent.id, is: .required, ofType: .string),
      .field(trainerActivityRecent.userSubId, is: .required, ofType: .string),
      .field(trainerActivityRecent.activity, is: .optional, ofType: .string),
      .field(trainerActivityRecent.timestamp, is: .optional, ofType: .dateTime),
      .field(trainerActivityRecent.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(trainerActivityRecent.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension TrainerActivityRecent: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}