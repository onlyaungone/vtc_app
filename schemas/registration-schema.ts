import * as Yup from 'yup';

export const registrationSchema = Yup.object().shape({
  dateOfBirth: Yup.string().required('Date of birth is required.'),
  // Uncomment and update the phone number validation if needed
  // phoneNumber: Yup.string()
  //   .required('Phone Number is required')
  //   .test(
  //     'len',
  //     'Phone Number must be exactly 9 characters',
  //     val => val.length === 13,
  //   ),
});
