// swiftlint:disable all
import Amplify
import Foundation

extension Match {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case status
    case personaltrainerID
    case inpersonclientID
    case onlineclientID
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let match = Match.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "Matches"
    model.syncPluralName = "Matches"
    
    model.attributes(
      .index(fields: ["personaltrainerID"], name: "byPersonalTrainer"),
      .index(fields: ["inpersonclientID"], name: "byInPersonClient"),
      .index(fields: ["onlineclientID"], name: "byOnlineClient"),
      .primaryKey(fields: [match.id])
    )
    
    model.fields(
      .field(match.id, is: .required, ofType: .string),
      .field(match.status, is: .optional, ofType: .string),
      .field(match.personaltrainerID, is: .required, ofType: .string),
      .field(match.inpersonclientID, is: .optional, ofType: .string),
      .field(match.onlineclientID, is: .optional, ofType: .string),
      .field(match.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(match.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension Match: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}