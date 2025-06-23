import * as Yup from 'yup';

export const choice = Yup.object().shape({
    selectedOption: Yup.string()
      .required('Please select an option'),
  });