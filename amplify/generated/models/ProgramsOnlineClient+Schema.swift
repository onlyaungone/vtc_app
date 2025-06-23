// swiftlint:disable all
import Amplify
import Foundation

extension ProgramsOnlineClient {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case programs
    case onlineClient
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let programsOnlineClient = ProgramsOnlineClient.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "ProgramsOnlineClients"
    model.syncPluralName = "ProgramsOnlineClients"
    
    model.attributes(
      .index(fields: ["programsId"], name: "byPrograms"),
      .index(fields: ["onlineClientId"], name: "byOnlineClient"),
      .primaryKey(fields: [programsOnlineClient.id])
    )
    
    model.fields(
      .field(programsOnlineClient.id, is: .required, ofType: .string),
      .belongsTo(programsOnlineClient.programs, is: .required, ofType: Programs.self, targetNames: ["programsId"]),
      .belongsTo(programsOnlineClient.onlineClient, is: .required, ofType: OnlineClient.self, targetNames: ["onlineClientId"]),
      .field(programsOnlineClient.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(programsOnlineClient.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension ProgramsOnlineClient: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}