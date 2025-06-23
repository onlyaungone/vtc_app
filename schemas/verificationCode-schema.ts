import * as Yup from 'yup';

export const verificationCodeSchema = Yup.object().shape({
    verificationCode: Yup.string()
      .min(6, 'Confirmation code is a 6 digit verification')
      .required('Confirmation code is required')
      .test(
        'len',
        'Confirmation Code must be exactly 6 characters',
        val => val.length === 6,
      ),
  });