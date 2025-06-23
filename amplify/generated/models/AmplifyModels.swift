// swiftlint:disable all
import Amplify
import Foundation

// Contains the set of classes that conforms to the `Model` protocol. 

final public class AmplifyModels: AmplifyModelRegistration {
  public let version: String = "a8b1b5c7693ffbc6642615ca7482f84b"
  
  public func registerModels(registry: ModelRegistry.Type) {
    ModelRegistry.register(modelType: TrainerActivityRecent.self)
    ModelRegistry.register(modelType: Programs.self)
    ModelRegistry.register(modelType: Match.self)
    ModelRegistry.register(modelType: ExerciseDetails.self)
    ModelRegistry.register(modelType: Workout.self)
    ModelRegistry.register(modelType: Exercises.self)
    ModelRegistry.register(modelType: InPersonClient.self)
    ModelRegistry.register(modelType: OnlineClient.self)
    ModelRegistry.register(modelType: PersonalTrainer.self)
    ModelRegistry.register(modelType: ProgramsWorkout.self)
    ModelRegistry.register(modelType: ProgramsInPersonClient.self)
    ModelRegistry.register(modelType: ProgramsOnlineClient.self)
    ModelRegistry.register(modelType: ExercisesWorkout.self)
  }
}