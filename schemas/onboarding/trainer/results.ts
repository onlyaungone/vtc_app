import * as Yup from 'yup';

export const results = Yup.object().shape({
  testimonials: Yup.string()
    .min(10, 'Please provide at least 10 characters for testimonials')
    .required('Client testimonials are required'),

  resultsPhotos: Yup.array()
    .required('At least one photo is required'),
});
