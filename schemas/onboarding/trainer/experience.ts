import * as Yup from 'yup';

export const experience = Yup.object().shape({
  experienceLevel: Yup.number()
    .typeError('Experience should be a number in years')
    .required('Your experience level is required'),

  mandatoryCertifications: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one mandatory certification')
    .required('Mandatory certifications are required'),

  additionalCertifications: Yup.array()
    .of(Yup.string()),

  customCertification: Yup.string().when('mandatoryCertifications', {
    is: (certs: string[]) => certs?.includes('Other'),
    then: (schema) =>
      schema
        .required('Please specify your custom certification')
        .min(3, 'Custom certification must be at least 3 characters'),
    otherwise: (schema) => schema.notRequired(),
  }),

  bio: Yup.string()
    .min(10, 'Your bio should be at least 10 characters long')
    .max(300, 'Your bio cannot exceed 300 characters')
    .required('Bio is required'),
});
