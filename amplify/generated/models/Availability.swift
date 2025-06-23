// swiftlint:disable all
import Amplify
import Foundation

public enum Availability: String, EnumPersistable {
  case monday = "MONDAY"
  case tuesday = "TUESDAY"
  case wednesday = "WEDNESDAY"
  case thursday = "THURSDAY"
  case friday = "FRIDAY"
  case saturday = "SATURDAY"
  case sunday = "SUNDAY"
}