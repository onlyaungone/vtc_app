// swiftlint:disable all
import Amplify
import Foundation

public struct Workout: Model {
  public let id: String
  public var name: String
  public var exercisess: List<ExercisesWorkout>?
  public var userSubId: String
  public var programss: List<ProgramsWorkout>?
  public var isComplete: Bool
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      name: String,
      exercisess: List<ExercisesWorkout>? = [],
      userSubId: String,
      programss: List<ProgramsWorkout>? = [],
      isComplete: Bool) {
    self.init(id: id,
      name: name,
      exercisess: exercisess,
      userSubId: userSubId,
      programss: programss,
      isComplete: isComplete,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      name: String,
      exercisess: List<ExercisesWorkout>? = [],
      userSubId: String,
      programss: List<ProgramsWorkout>? = [],
      isComplete: Bool,
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.name = name
      self.exercisess = exercisess
      self.userSubId = userSubId
      self.programss = programss
      self.isComplete = isComplete
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}