import * as Yup from 'yup';

export const profile = Yup.object().shape({
	age: Yup.number()
		.typeError('Age should be a number in years')
		.required('Age is required'),

	bio: Yup.string()
		.min(10, 'Your bio should be at least 10 characters long')
		.max(300, 'Your bio cannot exceed 300 characters')
		.required('Bio is required'),

	profilePhotos: Yup.array()
		.required('At least one photo is required'),
});