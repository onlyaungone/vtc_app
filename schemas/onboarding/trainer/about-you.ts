import * as Yup from 'yup';

export enum Days {
  Sunday = 'SUNDAY',
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
}

// Yup validation schema using Days enum
export const aboutYou = Yup.object().shape({
  availableDays: Yup.array()
    .of(Yup.string().oneOf(Object.values(Days) as Array<string>, 'Invalid day selected'))
    .min(1, 'Select at least one available day')
    .required('Availability is required'),

	trainingStyle: Yup.string().required('You should provide at least one training style!'),

  age: Yup.number()
    .required('Age is required')
    .min(18, 'Age must be at least 18 years of age')
    .max(60, 'Please pick a reasonable age')
});
