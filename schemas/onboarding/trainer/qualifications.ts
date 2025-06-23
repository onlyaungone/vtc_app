import * as Yup from 'yup';

export const qualifications = Yup.object().shape({
  qualifications: Yup.array()
    .required('At least one document is required')
});
