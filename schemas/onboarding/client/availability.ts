import { any } from 'prop-types';
import * as Yup from 'yup';

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
}

export const availability = Yup.object().shape({
  ageRangeMatters: Yup.boolean().required(),
  trainerAge: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)) // Handle empty strings
    .test('ageRequiredIfMatters', 'Age is required', function (value) {
      const { ageRangeMatters } = this.parent;
      if (!ageRangeMatters && (value === null || value === undefined)) {
        return false; // Fail validation if ageRangeMatters is false and age is not provided
      }
      return true;
    })
    .min(16, 'Age must be at least 16')
    .max(99, 'Age must be less than or equal to 99'),

    genderMatters: Yup.boolean().required(),
    trainerGender: Yup.string()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value)) // Handle empty strings for gender
      .test('genderRequiredIfMatters', 'Gender is required', function (value) {
        const { genderMatters } = this.parent;
        if (!genderMatters && !value) {
          return false; // Fail validation if genderMatters is false and gender is not provided
        }
        return true;
      })
      .oneOf([Gender.Male, Gender.Female], 'Select a valid gender'), // Accept only male or female

});

