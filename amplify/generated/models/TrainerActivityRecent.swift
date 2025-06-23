// swiftlint:disable all
import Amplify
import Foundation

public struct TrainerActivityRecent: Model {
  public let id: String
  public var userSubId: String
  public var activity: String?
  public var timestamp: Temporal.DateTime?
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      userSubId: String,
      activity: String? = nil,
      timestamp: Temporal.DateTime? = nil) {
    self.init(id: id,
      userSubId: userSubId,
      activity: activity,
      timestamp: timestamp,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      userSubId: String,
      activity: String? = nil,
      timestamp: Temporal.DateTime? = nil,
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.userSubId = userSubId
      self.activity = activity
      self.timestamp = timestamp
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}