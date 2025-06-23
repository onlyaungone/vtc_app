import * as Yup from 'yup';

export const location = Yup.object().shape({
	suburb: Yup.string()
    .required('Suburb is required'),

	gym: Yup.string()
    .required('Gym is required')
});
