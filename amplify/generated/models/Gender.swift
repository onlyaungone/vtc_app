// swiftlint:disable all
import Amplify
import Foundation

public enum Gender: String, EnumPersistable {
  case male = "MALE"
  case female = "FEMALE"
  case other = "OTHER"
}