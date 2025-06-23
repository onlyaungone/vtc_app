import * as Yup from 'yup';

export enum Days {
  SUNDAY = 'Sun',
  MONDAY = 'Mon',
  TUESDAY = 'Tue',
  WEDNESDAY = 'Wed',
  THURSDAY = 'Thu',
  FRIDAY = 'Fri',
  SATURDAY = 'Sat',
}

export enum Goal {
  WEIGHTLOSS=	"Lose Weight",
  MUSCLEBUILDING=	"Gain Muscle",
  STRENGTHTRAINING=	"Increase Strength",
  CARDIOVASCULAR=	"Improve Cardiovascular Health",
  ENDURANCE=	"Improve Endurance",
  MOBILITY=	"Improve Flexibility",
  POSTURECORRECTION=	"Improve Posture",
  REHABILITATION=	"Recover from Injury",
  FUNCTIONALTRAINING=	"Improve Functional Fitness",
  PREPOSTNATAL=	"Get Fit After Pregnancy",
  SPORTSTRAINING=	"Improve Sports Performance",
  HIIT=	"Improve Fitness with HIIT",
  CALISTHENICS=	"Learn Calisthenics",
  POWERLIFTING=	"Learn Powerlifting",
  OLYMPICLIFTING=	"Learn Olympic Weightlifting",
  CROSSFIT=	"CrossFit",
  GYMNASTICS=	"Improve Gymnastics Skills",
  MARTIALART=	"Improve Martial Arts Fitness",
  SENIORFITNESS=	"Maintain Fitness in Older Age",
  YOUTHTRAINING=	"Build Fitness for Youth",
  SPEEDAGILITY=	"Improve Speed and Agility",
  NUTRITIONALCOACHING=	"Improve Nutrition",
  MENTALWELLBEING=	"Improve Mental Well-being",
  BODYBUILDINGCOMPETITION=	"Bodybuilding and Competition Prep",
  HOLISTICHEALTH=	"Holistic Health and Wellness",
  ONLINECOACH=	"Online Coaching",
  TRAINOUTDOOR=	"Train Outdoors",
  YOGA=	"Yoga",
  PILATES=	"Pilates ",
  GROUPFITNESS=	"Group Fitness",
  TRXSUSPENSION=	"TRX/Suspension Training",
  KETTLEBELL=	"Kettlebell Training",
  PLYOMETRICTRAINING=	"Plyometric Training",
  CIRCUITTRAINING=	"Circuit Training",
  BALANCESTABILITY=	"Improve Balance and Stability",
  BUILDCORE=	"Build Core Strength",
}

// Yup validation schema using Days enum
export const details = Yup.object().shape({
  availableDays: Yup.array()
    .of(Yup.string().oneOf(Object.values(Days) as Array<string>, 'Invalid day selected'))
    .min(1, 'Select at least one available day')
    .required('Availability is required'),

  goals: Yup.array()
  .of(Yup.string().oneOf(Object.values(Goal) as Array<string>, 'Invalid Goal selected'))
  .min(1, 'Select at least one Goal')
  .required('Goal is required'),
  
});