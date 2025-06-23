// swiftlint:disable all
import Amplify
import Foundation

extension Programs {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case name
    case userSubId
    case ProgramWorkout
    case InPersonClients
    case OnlineClients
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let programs = Programs.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "Programs"
    model.syncPluralName = "Programs"
    
    model.attributes(
      .primaryKey(fields: [programs.id])
    )
    
    model.fields(
      .field(programs.id, is: .required, ofType: .string),
      .field(programs.name, is: .optional, ofType: .string),
      .field(programs.userSubId, is: .optional, ofType: .string),
      .hasMany(programs.ProgramWorkout, is: .optional, ofType: ProgramsWorkout.self, associatedWith: ProgramsWorkout.keys.programs),
      .hasMany(programs.InPersonClients, is: .optional, ofType: ProgramsInPersonClient.self, associatedWith: ProgramsInPersonClient.keys.programs),
      .hasMany(programs.OnlineClients, is: .optional, ofType: ProgramsOnlineClient.self, associatedWith: ProgramsOnlineClient.keys.programs),
      .field(programs.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(programs.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension Programs: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}