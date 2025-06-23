// swiftlint:disable all
import Amplify
import Foundation

public struct ProgramsInPersonClient: Model {
  public let id: String
  public var programs: Programs
  public var inPersonClient: InPersonClient
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      programs: Programs,
      inPersonClient: InPersonClient) {
    self.init(id: id,
      programs: programs,
      inPersonClient: inPersonClient,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      programs: Programs,
      inPersonClient: InPersonClient,
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.programs = programs
      self.inPersonClient = inPersonClient
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}