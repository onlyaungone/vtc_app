// swiftlint:disable all
import Amplify
import Foundation

public struct ProgramsOnlineClient: Model {
  public let id: String
  public var programs: Programs
  public var onlineClient: OnlineClient
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      programs: Programs,
      onlineClient: OnlineClient) {
    self.init(id: id,
      programs: programs,
      onlineClient: onlineClient,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      programs: Programs,
      onlineClient: OnlineClient,
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.programs = programs
      self.onlineClient = onlineClient
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}