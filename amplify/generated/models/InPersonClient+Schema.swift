// swiftlint:disable all
import Amplify
import Foundation

extension InPersonClient {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case name
    case gender
    case age
    case location
    case gymLocation
    case sub
    case Matches
    case programss
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let inPersonClient = InPersonClient.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "InPersonClients"
    model.syncPluralName = "InPersonClients"
    
    model.attributes(
      .primaryKey(fields: [inPersonClient.id])
    )
    
    model.fields(
      .field(inPersonClient.id, is: .required, ofType: .string),
      .field(inPersonClient.name, is: .optional, ofType: .string),
      .field(inPersonClient.gender, is: .optional, ofType: .enum(type: Gender.self)),
      .field(inPersonClient.age, is: .optional, ofType: .int),
      .field(inPersonClient.location, is: .optional, ofType: .string),
      .field(inPersonClient.gymLocation, is: .optional, ofType: .string),
      .field(inPersonClient.sub, is: .optional, ofType: .string),
      .hasMany(inPersonClient.Matches, is: .optional, ofType: Match.self, associatedWith: Match.keys.inpersonclientID),
      .hasMany(inPersonClient.programss, is: .optional, ofType: ProgramsInPersonClient.self, associatedWith: ProgramsInPersonClient.keys.inPersonClient),
      .field(inPersonClient.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(inPersonClient.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension InPersonClient: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}