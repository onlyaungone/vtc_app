// swiftlint:disable all
import Amplify
import Foundation

public enum Niche: String, EnumPersistable {
  case bodybuilding = "BODYBUILDING"
  case powerlifting = "POWERLIFTING"
  case weightloss = "WEIGHTLOSS"
  case metcon = "METCON"
  case functionalfitness = "FUNCTIONALFITNESS"
}