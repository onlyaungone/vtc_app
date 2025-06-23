// swiftlint:disable all
import Amplify
import Foundation

public struct ExercisesWorkout: Model {
  public let id: String
  public var workout: Workout
  public var exercises: Exercises
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      workout: Workout,
      exercises: Exercises) {
    self.init(id: id,
      workout: workout,
      exercises: exercises,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      workout: Workout,
      exercises: Exercises,
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.workout = workout
      self.exercises = exercises
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}