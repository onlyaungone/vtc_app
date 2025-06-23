// swiftlint:disable all
import Amplify
import Foundation

public struct InPersonClient: Model {
  public let id: String
  public var name: String?
  public var gender: Gender?
  public var age: Int?
  public var location: String?
  public var gymLocation: String?
  public var sub: String?
  public var Matches: List<Match>?
  public var programss: List<ProgramsInPersonClient>?
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      name: String? = nil,
      gender: Gender? = nil,
      age: Int? = nil,
      location: String? = nil,
      gymLocation: String? = nil,
      sub: String? = nil,
      Matches: List<Match>? = [],
      programss: List<ProgramsInPersonClient>? = []) {
    self.init(id: id,
      name: name,
      gender: gender,
      age: age,
      location: location,
      gymLocation: gymLocation,
      sub: sub,
      Matches: Matches,
      programss: programss,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      name: String? = nil,
      gender: Gender? = nil,
      age: Int? = nil,
      location: String? = nil,
      gymLocation: String? = nil,
      sub: String? = nil,
      Matches: List<Match>? = [],
      programss: List<ProgramsInPersonClient>? = [],
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.name = name
      self.gender = gender
      self.age = age
      self.location = location
      self.gymLocation = gymLocation
      self.sub = sub
      self.Matches = Matches
      self.programss = programss
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}