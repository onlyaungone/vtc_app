import * as Yup from "yup";

export enum TrainingStyle {
  WEIGHTLOSS=	"Weight Loss",
  MUSCLEBUILDING=	"Muscle Building (Hypertrophy)",
  STRENGTHTRAINING=	"Strength Training",
  CARDIOVASCULAR=	"Cardiovascular Fitness",
  ENDURANCE=	"Endurance Training",
  MOBILITY=	"Mobility and Flexibility",
  POSTURECORRECTION=	"Posture Correction",
  REHABILITATION=	"Rehabilitation and Injury Prevention",
  FUNCTIONALTRAINING=	"Functional Training",
  PREPOSTNATAL=	"Pre/Postnatal Fitness",
  SPORTSTRAINING=	"Sports-Specific Training",
  HIIT=	"High-Intensity Interval Training (HIIT)",
  CALISTHENICS=	"Bodyweight Training (Calisthenics)",
  POWERLIFTING=	"Powerlifting",
  OLYMPICLIFTING=	"Olympic Lifting",
  CROSSFIT=	"CrossFit",
  GYMNASTICS=	"Gymnastics Conditioning",
  MARTIALART=	"Martial Arts Fitness",
  SENIORFITNESS=	"Senior Fitness",
  YOUTHTRAINING=	"Youth Training",
  SPEEDAGILITY=	"Speed and Agility",
  NUTRITIONALCOACHING=	"Nutritional Coaching",
  MENTALWELLBEING=	"Mental and Emotional Well-being",
  BODYBUILDINGCOMPETITION=	"Bodybuilding and Competition Prep",
  HOLISTICHEALTH=	"Holistic Health and Wellness",
  ONLINECOACH=	"Online Coaching",
  TRAINOUTDOOR=	"Outdoor Training",
  YOGA=	"Yoga",
  PILATES=	"Pilates ",
  GROUPFITNESS=	"Group Fitness",
  TRXSUSPENSION=	"TRX/Suspension Training",
  KETTLEBELL=	"Kettlebell Training",
  PLYOMETRICTRAINING=	"Plyometric Training",
  CIRCUITTRAINING=	"Circuit Training",
  BALANCESTABILITY=	"Balance and Stability Training",
  BUILDCORE=	"Core Strength",
}

export enum Education {
  CertIII=	"Certificate III in Fitness",
  CertIV=	"Certificate IV in Fitness",
  DiplomaofFitness=	"Diploma of Fitness",
  ASCA=	"ASCA (Strength and Conditioning)",
  ASCALevel1Cert=	"ASCA Level 1 Certification",
  ASCALevel2Cert=	"ASCA Level 2 Certification",
  ASCALevel3Cert=	"ASCA Level 3 Certification",
  NutritionCert=	"Nutrition Certifications",
  Level1SportsNutritionCert=	"Level 1 Sports Nutrition Certification",
  Level2SportsNutritionCert=	"Level 2 Sports Nutrition Certification",
  NutritionforPTCert=	"Nutrition for Personal Trainers Certification",
  YogaTeacherTraining=	"Yoga Teacher Training",
  YogaTeacherTraining200Hours=	"Yoga Teacher Training (200 Hours)",
  YogaTeacherTraining500Hours=	"Yoga Teacher Training (500 Hours)",
  SpecialtyCertifications=	"Specialty Certifications",
  PilatesInstructorCertification=	"Pilates Instructor Certification",
  GroupFitnessInstructorCertification=	"Group Fitness Instructor Certification",
  LesMillsInstructorCertifications=	"Les Mills Instructor Certifications",
  AquaAerobicsInstructorCertification=	"Aqua Aerobics Instructor Certification",
  BoxingforFitnessCertification=	"Boxing for Fitness Certification",
  CrossFitLevel1Certification=	"CrossFit Level 1 Certification",
  TRXSuspensionTrainingCertification=	"TRX Suspension Training Certification",
  KettlebellInstructorCertification=	"Kettlebell Instructor Certification",
  OlderAdultsFitnessCertification=	"Older Adults Fitness Certification",
  PrePostnatalExerciseCertification=	"Pre/Postnatal Exercise Certification",
  ChildrenÄôsFitnessCertification=	"Children‚Äôs Fitness Certification",
  HigherEducationDegrees=	"Higher Education Degrees",
  BachelorofExerciseandSportScience=	"Bachelor of Exercise and Sport Science",
  BachelorofHealthandPhysicalEducation=	"Bachelor of Health and Physical Education",
  BachelorofAppliedFitness=	"Bachelor of Applied Fitness",
  BachelorofSportandExerciseScience=	"Bachelor of Sport and Exercise Science (Strength and Conditioning)",
  BachelorofExercisePhysiology=	"Bachelor of Exercise Physiology",
  GraduateDiplomaofExerciseScience=	"Graduate Diploma of Exercise Science",
  MasterofClinicalExercisePhysiology=	"Master of Clinical Exercise Physiology",
  MasterofSportsCoaching=	"Master of Sports Coaching",
  PhDinExerciseScienceSportScience=	"PhD in Exercise Science/Sport Science",
}

export const experience = Yup.object().shape({
  experienceMatters: Yup.boolean().required(), // Adding the boolean to handle condition
  experienceLevel: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .test(
      "experienceRequiredIfMatters",
      "Experience is required",
      function (value) {
        const { experienceMatters } = this.parent;
        // if (experienceMatters && (value === null || value === undefined)) {
          if (experienceMatters){
          return true; // Fail validation if experienceMatters is false and experience is not provided
        }
        return !!value;
      }
    )
    .min(1, "Experience must be at least 1 year")
    .typeError("Experience should be a number in years"),

  educationMatters: Yup.boolean().required(),
  educationLevel: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .test(
      "educationRequiredIfMatters",
      "Select a valid education level",
      function (value) {
        const { educationMatters } = this.parent;
        if (educationMatters) {
          return true; // If education doesn't matter, no validation is needed
        }
        // If education does matter, we validate that the value is provided
        return !!value;
      }
    )
    .oneOf(Object.values(Education), "Select a valid education level"),

  trainingStyle: Yup.string()
    .nullable()
    .required("Training style or specialities is required")
    .oneOf(Object.values(TrainingStyle), "Select a valid training style"),
});
