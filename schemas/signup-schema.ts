import * as Yup from 'yup';

export const signUpSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password'), 'Passwords must match']),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });