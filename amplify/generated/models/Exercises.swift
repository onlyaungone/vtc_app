// swiftlint:disable all
import Amplify
import Foundation

public struct Exercises: Model {
  public let id: String
  public var bodyPart: String?
  public var equipment: String?
  public var instructions: [String?]?
  public var name: String?
  public var secondaryMuscles: [String?]?
  public var target: String?
  public var Workouts: List<ExercisesWorkout>?
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      bodyPart: String? = nil,
      equipment: String? = nil,
      instructions: [String?]? = nil,
      name: String? = nil,
      secondaryMuscles: [String?]? = nil,
      target: String? = nil,
      Workouts: List<ExercisesWorkout>? = []) {
    self.init(id: id,
      bodyPart: bodyPart,
      equipment: equipment,
      instructions: instructions,
      name: name,
      secondaryMuscles: secondaryMuscles,
      target: target,
      Workouts: Workouts,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      bodyPart: String? = nil,
      equipment: String? = nil,
      instructions: [String?]? = nil,
      name: String? = nil,
      secondaryMuscles: [String?]? = nil,
      target: String? = nil,
      Workouts: List<ExercisesWorkout>? = [],
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.bodyPart = bodyPart
      self.equipment = equipment
      self.instructions = instructions
      self.name = name
      self.secondaryMuscles = secondaryMuscles
      self.target = target
      self.Workouts = Workouts
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}