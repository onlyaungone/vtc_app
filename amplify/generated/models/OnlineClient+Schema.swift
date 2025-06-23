// swiftlint:disable all
import Amplify
import Foundation

extension OnlineClient {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case name
    case age
    case gender
    case trainerAge
    case trainerGender
    case niche
    case availability
    case trainerEducation
    case sub
    case Matches
    case programss
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let onlineClient = OnlineClient.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "OnlineClients"
    model.syncPluralName = "OnlineClients"
    
    model.attributes(
      .primaryKey(fields: [onlineClient.id])
    )
    
    model.fields(
      .field(onlineClient.id, is: .required, ofType: .string),
      .field(onlineClient.name, is: .optional, ofType: .string),
      .field(onlineClient.age, is: .optional, ofType: .int),
      .field(onlineClient.gender, is: .required, ofType: .enum(type: Gender.self)),
      .field(onlineClient.trainerAge, is: .optional, ofType: .int),
      .field(onlineClient.trainerGender, is: .optional, ofType: .enum(type: Gender.self)),
      .field(onlineClient.niche, is: .optional, ofType: .enum(type: Niche.self)),
      .field(onlineClient.availability, is: .optional, ofType: .embeddedCollection(of: Availability.self)),
      .field(onlineClient.trainerEducation, is: .optional, ofType: .string),
      .field(onlineClient.sub, is: .optional, ofType: .string),
      .hasMany(onlineClient.Matches, is: .optional, ofType: Match.self, associatedWith: Match.keys.onlineclientID),
      .hasMany(onlineClient.programss, is: .optional, ofType: ProgramsOnlineClient.self, associatedWith: ProgramsOnlineClient.keys.onlineClient),
      .field(onlineClient.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(onlineClient.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension OnlineClient: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}