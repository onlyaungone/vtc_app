import * as Yup from 'yup';

export const personality = Yup.object().shape({
  quote: Yup.string()
    .min(3, 'Please provide a one liner or favourite quote')
    .required('A quote is required!'),

  profilePhotos: Yup.array()
  .required('At least one photo is required'),

  website: Yup.string()
    .url('Must be a valid URL')
    .nullable(),

  socials: Yup.string()
    .nullable()
    .matches(
      /(?:www\.)?(?:facebook|twitter|x|instagram|linkedin|tiktok)\.com\/(?:[\w\-]*)/i,
      'Must be a valid social media link'
    )
    // Convert empty string to null if not provided to handle when non provided with match
    .transform((value, originalValue) => originalValue === '' ? null : value),
})