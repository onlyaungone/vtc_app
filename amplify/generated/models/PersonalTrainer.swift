// swiftlint:disable all
import Amplify
import Foundation

public struct PersonalTrainer: Model {
  public let id: String
  public var name: String
  public var education: String
  public var experience: Int
  public var niche: Niche
  public var availability: [Availability]?
  public var location: String
  public var sub: String
  public var age: Int
  public var gender: Gender
  public var bio: String?
  public var isApproved: Bool?
  public var image: String?
  public var gymLocation: String?
  public var Matches: List<Match>?
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      name: String,
      education: String,
      experience: Int,
      niche: Niche,
      availability: [Availability]? = nil,
      location: String,
      sub: String,
      age: Int,
      gender: Gender,
      bio: String? = nil,
      isApproved: Bool? = nil,
      image: String? = nil,
      gymLocation: String? = nil,
      Matches: List<Match>? = []) {
    self.init(id: id,
      name: name,
      education: education,
      experience: experience,
      niche: niche,
      availability: availability,
      location: location,
      sub: sub,
      age: age,
      gender: gender,
      bio: bio,
      isApproved: isApproved,
      image: image,
      gymLocation: gymLocation,
      Matches: Matches,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      name: String,
      education: String,
      experience: Int,
      niche: Niche,
      availability: [Availability]? = nil,
      location: String,
      sub: String,
      age: Int,
      gender: Gender,
      bio: String? = nil,
      isApproved: Bool? = nil,
      image: String? = nil,
      gymLocation: String? = nil,
      Matches: List<Match>? = [],
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.name = name
      self.education = education
      self.experience = experience
      self.niche = niche
      self.availability = availability
      self.location = location
      self.sub = sub
      self.age = age
      self.gender = gender
      self.bio = bio
      self.isApproved = isApproved
      self.image = image
      self.gymLocation = gymLocation
      self.Matches = Matches
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}