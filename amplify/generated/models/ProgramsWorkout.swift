// swiftlint:disable all
import Amplify
import Foundation

public struct ProgramsWorkout: Model {
  public let id: String
  public var programs: Programs
  public var workout: Workout
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      programs: Programs,
      workout: Workout) {
    self.init(id: id,
      programs: programs,
      workout: workout,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      programs: Programs,
      workout: Workout,
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.programs = programs
      self.workout = workout
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}