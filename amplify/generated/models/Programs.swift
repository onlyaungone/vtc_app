// swiftlint:disable all
import Amplify
import Foundation

public struct Programs: Model {
  public let id: String
  public var name: String?
  public var userSubId: String?
  public var ProgramWorkout: List<ProgramsWorkout>?
  public var InPersonClients: List<ProgramsInPersonClient>?
  public var OnlineClients: List<ProgramsOnlineClient>?
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      name: String? = nil,
      userSubId: String? = nil,
      ProgramWorkout: List<ProgramsWorkout>? = [],
      InPersonClients: List<ProgramsInPersonClient>? = [],
      OnlineClients: List<ProgramsOnlineClient>? = []) {
    self.init(id: id,
      name: name,
      userSubId: userSubId,
      ProgramWorkout: ProgramWorkout,
      InPersonClients: InPersonClients,
      OnlineClients: OnlineClients,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      name: String? = nil,
      userSubId: String? = nil,
      ProgramWorkout: List<ProgramsWorkout>? = [],
      InPersonClients: List<ProgramsInPersonClient>? = [],
      OnlineClients: List<ProgramsOnlineClient>? = [],
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.name = name
      self.userSubId = userSubId
      self.ProgramWorkout = ProgramWorkout
      self.InPersonClients = InPersonClients
      self.OnlineClients = OnlineClients
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}