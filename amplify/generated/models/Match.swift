// swiftlint:disable all
import Amplify
import Foundation

public struct Match: Model {
  public let id: String
  public var status: String?
  public var personaltrainerID: String
  public var inpersonclientID: String?
  public var onlineclientID: String?
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      status: String? = nil,
      personaltrainerID: String,
      inpersonclientID: String? = nil,
      onlineclientID: String? = nil) {
    self.init(id: id,
      status: status,
      personaltrainerID: personaltrainerID,
      inpersonclientID: inpersonclientID,
      onlineclientID: onlineclientID,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      status: String? = nil,
      personaltrainerID: String,
      inpersonclientID: String? = nil,
      onlineclientID: String? = nil,
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.status = status
      self.personaltrainerID = personaltrainerID
      self.inpersonclientID = inpersonclientID
      self.onlineclientID = onlineclientID
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}