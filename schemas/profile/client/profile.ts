import * as Yup from 'yup';

export const profile = Yup.object().shape({
  age: Yup.string()
    .required('Client age is required'),

  gender: Yup.array()
    .required('Client gender is required'),
    
  trainingAt: Yup.string()
    .optional(),

  // TODO: Add more social media links
  description: Yup.string()
    .optional(),

  about: Yup.string()
    .required('Client about are required'),

  goals: Yup.string()
    .required('Client goals are required'),

  availability: Yup.string()
    .required('Client availabilities are required'),
});
