// swiftlint:disable all
import Amplify
import Foundation

public struct OnlineClient: Model {
  public let id: String
  public var name: String?
  public var age: Int?
  public var gender: Gender
  public var trainerAge: Int?
  public var trainerGender: Gender?
  public var niche: Niche?
  public var availability: [Availability?]?
  public var trainerEducation: String?
  public var sub: String?
  public var Matches: List<Match>?
  public var programss: List<ProgramsOnlineClient>?
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      name: String? = nil,
      age: Int? = nil,
      gender: Gender,
      trainerAge: Int? = nil,
      trainerGender: Gender? = nil,
      niche: Niche? = nil,
      availability: [Availability?]? = nil,
      trainerEducation: String? = nil,
      sub: String? = nil,
      Matches: List<Match>? = [],
      programss: List<ProgramsOnlineClient>? = []) {
    self.init(id: id,
      name: name,
      age: age,
      gender: gender,
      trainerAge: trainerAge,
      trainerGender: trainerGender,
      niche: niche,
      availability: availability,
      trainerEducation: trainerEducation,
      sub: sub,
      Matches: Matches,
      programss: programss,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      name: String? = nil,
      age: Int? = nil,
      gender: Gender,
      trainerAge: Int? = nil,
      trainerGender: Gender? = nil,
      niche: Niche? = nil,
      availability: [Availability?]? = nil,
      trainerEducation: String? = nil,
      sub: String? = nil,
      Matches: List<Match>? = [],
      programss: List<ProgramsOnlineClient>? = [],
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.name = name
      self.age = age
      self.gender = gender
      self.trainerAge = trainerAge
      self.trainerGender = trainerGender
      self.niche = niche
      self.availability = availability
      self.trainerEducation = trainerEducation
      self.sub = sub
      self.Matches = Matches
      self.programss = programss
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}