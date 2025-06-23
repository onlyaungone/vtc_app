// swiftlint:disable all
import Amplify
import Foundation

extension PersonalTrainer {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case name
    case education
    case experience
    case niche
    case availability
    case location
    case sub
    case age
    case gender
    case bio
    case isApproved
    case image
    case gymLocation
    case Matches
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let personalTrainer = PersonalTrainer.keys
    
    model.authRules = [
      rule(allow: .public, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "PersonalTrainers"
    model.syncPluralName = "PersonalTrainers"
    
    model.attributes(
      .primaryKey(fields: [personalTrainer.id])
    )
    
    model.fields(
      .field(personalTrainer.id, is: .required, ofType: .string),
      .field(personalTrainer.name, is: .required, ofType: .string),
      .field(personalTrainer.education, is: .required, ofType: .string),
      .field(personalTrainer.experience, is: .required, ofType: .int),
      .field(personalTrainer.niche, is: .required, ofType: .enum(type: Niche.self)),
      .field(personalTrainer.availability, is: .optional, ofType: .embeddedCollection(of: Availability.self)),
      .field(personalTrainer.location, is: .required, ofType: .string),
      .field(personalTrainer.sub, is: .required, ofType: .string),
      .field(personalTrainer.age, is: .required, ofType: .int),
      .field(personalTrainer.gender, is: .required, ofType: .enum(type: Gender.self)),
      .field(personalTrainer.bio, is: .optional, ofType: .string),
      .field(personalTrainer.isApproved, is: .optional, ofType: .bool),
      .field(personalTrainer.image, is: .optional, ofType: .string),
      .field(personalTrainer.gymLocation, is: .optional, ofType: .string),
      .hasMany(personalTrainer.Matches, is: .optional, ofType: Match.self, associatedWith: Match.keys.personaltrainerID),
      .field(personalTrainer.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(personalTrainer.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
}

extension PersonalTrainer: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}