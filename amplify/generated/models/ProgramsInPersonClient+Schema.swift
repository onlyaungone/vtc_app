// swiftlint:disable all
import Amplify
import Foundation

extension ProgramsInPersonClient {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case programs
    case inPersonClient
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let programsInPersonClient = ProgramsInPersonClient.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "ProgramsInPersonClients"
    model.syncPluralName = "ProgramsInPersonClients"
    
    model.attributes(
      .index(fields: ["programsId"], name: "byPrograms"),
      .index(fields: ["inPersonClientId"], name: "byInPersonClient"),
      .primaryKey(fields: [programsInPersonClient.id])
    )
    
    model.fields(
      .field(programsInPersonClient.id, is: .required, ofType: .string),
      .belongsTo(programsInPersonClient.programs, is: .required, ofType: Programs.self, targetNames: ["programsId"]),
      .belongsTo(programsInPersonClient.inPersonClient, is: .required, ofType: InPersonClient.self, targetNames: ["inPersonClientId"]),
      .field(programsInPersonClient.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(programsInPersonClient.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension ProgramsInPersonClient: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}