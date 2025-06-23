import { useState } from 'react';
import * as Yup from 'yup';

import { 
  ClientDetailSchema,
  ClientProfileSchema,
  ClientChoiceSchema,
  ClientLocationSchema,
  ClientAvailabilitySchema,
  ClientExperienceSchema  
} from "@/schemas/onboarding/client"

interface ClientOnboardingState {
  details: typeof ClientDetailSchema | null;
  profile: typeof ClientProfileSchema | null;
  choice: typeof ClientChoiceSchema | null;
  availability: typeof ClientAvailabilitySchema | null;
  experience: typeof ClientExperienceSchema | null;
  location: typeof ClientLocationSchema | null;
}

export const useClientOnboarding = () => {
  const [formState, setFormState] = useState<ClientOnboardingState>({
    details: null,
    profile: null,
    choice: null,
    location: null,
    experience:null,
    availability: null
  });

  const saveSchema = async (schemaType: 'details' | 'profile' | 'choice' | 'location' | 'experience' | 'availability', formData: any) => {
    let schema: Yup.ObjectSchema<any>;

    switch (schemaType) {
      case 'details':
        schema = ClientDetailSchema;
        break;
      case 'profile':
        schema = ClientProfileSchema;
        break;
        case 'choice':
          schema = ClientChoiceSchema;
          break;
      case 'availability':
        schema = ClientAvailabilitySchema;
        break;
      case 'experience':
        schema = ClientExperienceSchema;
        break;
      case 'location':
        schema = ClientLocationSchema;
        break;
      default:
        throw new Error('Invalid schema type');
    }

    try {
      const validated = await schema.validate(formData, { abortEarly: false });

      setFormState((prevState) => ({
        ...prevState,
        [schemaType]: validated,
      }));

      console.log(`Saved ${schemaType} data:`, validated);
    } catch (validationErrors) {
      console.error('Validation failed:', validationErrors);
    }
  };

  const clearSchema = (schemaType: 'details' | 'profile' | 'choice' | 'location' | 'experience' | 'availability') => {
    setFormState((prevState) => ({
      ...prevState,
      [schemaType]: null,
    }));

    console.log(`Cleared ${schemaType} data.`);
  };

  const submit = () => {
    if (!formState.details || !formState.profile || !formState.choice || !formState.availability || !formState.experience || !formState.location ) {
      // Should NEVER happen but to satisfy TypeScript
      console.error('Some schemas are missing.');
      return;
    }

    const mergedData = {
      ...formState.details,
      ...formState.profile,
      ...formState.choice,
      ...formState.availability,
      ...formState.experience,
      ...formState.profile,
      ...formState.location
    };

    console.log('Merged data:', mergedData);

    // TODO: Submit to AWS
  };

  return { saveSchema, clearSchema, submit }
}