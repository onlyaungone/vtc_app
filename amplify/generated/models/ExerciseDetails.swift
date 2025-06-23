// swiftlint:disable all
import Amplify
import Foundation

public struct ExerciseDetails: Model {
  public let id: String
  public var load: String?
  public var reps: String?
  public var weightKGS: String?
  public var weightLBS: String?
  public var time: Temporal.Time?
  public var bodyweight: String?
  public var plateLevel: String?
  public var rpe: String?
  public var repRange: String?
  public var asManyRepsAsPossible: String?
  public var tempo: String?
  public var rest: Temporal.Time?
  public var workoutExerciseId: String
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      load: String? = nil,
      reps: String? = nil,
      weightKGS: String? = nil,
      weightLBS: String? = nil,
      time: Temporal.Time? = nil,
      bodyweight: String? = nil,
      plateLevel: String? = nil,
      rpe: String? = nil,
      repRange: String? = nil,
      asManyRepsAsPossible: String? = nil,
      tempo: String? = nil,
      rest: Temporal.Time? = nil,
      workoutExerciseId: String) {
    self.init(id: id,
      load: load,
      reps: reps,
      weightKGS: weightKGS,
      weightLBS: weightLBS,
      time: time,
      bodyweight: bodyweight,
      plateLevel: plateLevel,
      rpe: rpe,
      repRange: repRange,
      asManyRepsAsPossible: asManyRepsAsPossible,
      tempo: tempo,
      rest: rest,
      workoutExerciseId: workoutExerciseId,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      load: String? = nil,
      reps: String? = nil,
      weightKGS: String? = nil,
      weightLBS: String? = nil,
      time: Temporal.Time? = nil,
      bodyweight: String? = nil,
      plateLevel: String? = nil,
      rpe: String? = nil,
      repRange: String? = nil,
      asManyRepsAsPossible: String? = nil,
      tempo: String? = nil,
      rest: Temporal.Time? = nil,
      workoutExerciseId: String,
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.load = load
      self.reps = reps
      self.weightKGS = weightKGS
      self.weightLBS = weightLBS
      self.time = time
      self.bodyweight = bodyweight
      self.plateLevel = plateLevel
      self.rpe = rpe
      self.repRange = repRange
      self.asManyRepsAsPossible = asManyRepsAsPossible
      self.tempo = tempo
      self.rest = rest
      self.workoutExerciseId = workoutExerciseId
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}