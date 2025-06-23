import { create } from 'zustand';
import * as Crypto from 'expo-crypto';

import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

// Amplify-generated models
import { Gender, Niche } from '@/models';

import * as Yup from 'yup';

import {
	TrainerAboutYouSchema,
	TrainerLocationSchema,
	TrainerExperienceSchema,
	TrainerPersonalitySchema,
	TrainerResultsSchema,
	TrainerQualificationsSchema
} from '@/schemas/onboarding/trainer';

import { useActiveUserStore } from '../useActiveUser';

interface TrainerOnboardingState {
	aboutYou: Yup.InferType<typeof TrainerAboutYouSchema> | null;
	location: Yup.InferType<typeof TrainerLocationSchema> | null;
	experience: Yup.InferType<typeof TrainerExperienceSchema> | null;
	personality: Yup.InferType<typeof TrainerPersonalitySchema> | null;
	results: Yup.InferType<typeof TrainerResultsSchema> | null;
	qualifications: Yup.InferType<typeof TrainerQualificationsSchema> | null;
}

type SchemaType =
	| 'aboutYou'
	| 'location'
	| 'experience'
	| 'personality'
	| 'results'
	| 'qualifications';

interface TrainerOnboardingStore {
	formState: TrainerOnboardingState;
	userGender: Gender | null;
	setUserGender: (gender: string) => void;
	saveSchema: (schemaType: SchemaType, formData: any) => Promise<void>;
	clearSchema: (schemaType: SchemaType) => void;
	submit: () => Promise<void>;
}

export const useTrainerOnboardingStore = create<TrainerOnboardingStore>((set, get) => ({
	formState: {
		aboutYou: null,
		location: null,
		experience: null,
		personality: null,
		results: null,
		qualifications: null
	},

	userGender: Gender.OTHER,
	setUserGender: (gender: string) => {
		let selectedGender;

		switch (gender.toLowerCase()) {
			case 'male':
				selectedGender = Gender.MALE;
				break;
			case 'female':
				selectedGender = Gender.FEMALE;
				break;
			case 'other':
				selectedGender = Gender.OTHER;
				break;
			default:
				throw new Error('Could not set onboarding user gender.');
		}

		set({ userGender: selectedGender });
	},

	saveSchema: async (schemaType, formData) => {
		let schema: Yup.ObjectSchema<any>;

		switch (schemaType) {
			case 'aboutYou':
				schema = TrainerAboutYouSchema;
				break;
			case 'location':
				schema = TrainerLocationSchema;
				break;
			case 'experience':
				schema = TrainerExperienceSchema;
				break;
			case 'personality':
				schema = TrainerPersonalitySchema;
				break;
			case 'results':
				schema = TrainerResultsSchema;
				break;
			case 'qualifications':
				schema = TrainerQualificationsSchema;
				break;
			default:
				throw new Error('Invalid schema type');
		}

		try {
			const validated = await schema.validate(formData, { abortEarly: false });

			if (schemaType === 'experience') {
				const combinedCertifications = [
					...(validated.mandatoryCertifications ?? []),
					...(validated.additionalCertifications ?? []),
					...(validated.mandatoryCertifications?.includes('Other') && validated.customCertification
						? [validated.customCertification]
						: []),
				];

				set((state) => ({
					formState: {
						...state.formState,
						experience: {
							...validated,
							certifications: combinedCertifications,
						},
					},
				}));
			} else {
				set((state) => ({
					formState: {
						...state.formState,
						[schemaType]: validated,
					},
				}));
			}

			console.log(`Saved ${schemaType} data:`, validated);
		} catch (validationErrors) {
			console.error('Validation failed:', validationErrors);
		}
	},

	clearSchema: (schemaType) => {
		set((state) => ({
			formState: {
				...state.formState,
				[schemaType]: null
			}
		}));

		console.log(`Cleared ${schemaType} data.`);
	},

	submit: async () => {
		const formState = get().formState;
		const gender = get().userGender;

		const missingFields: string[] = [];
		if (!gender) missingFields.push('gender');
		if (!formState.aboutYou) missingFields.push('aboutYou');
		if (!formState.experience) missingFields.push('experience');
		if (!formState.personality) missingFields.push('personality');
		if (!formState.results) missingFields.push('results');
		if (!formState.qualifications) missingFields.push('qualifications');

		if (missingFields.length > 0) {
			console.error('The following schemas are missing:', missingFields.join(', '));
			throw new Error(`Cannot submit, missing: ${missingFields.join(', ')}`);
		}

		const merged = {
			...formState.aboutYou,
			...formState.location,
			...formState.experience,
			...formState.personality,
			...formState.results,
			...formState.qualifications
		};

		const { username } = await getCurrentUser();
		const attributes = await fetchUserAttributes();
		console.log('Merged: ', merged);
		console.log('User attributes: ', attributes);

		const item = {
			id: Crypto.randomUUID(),
			sub: username,
			name: attributes['custom:fullName'],
			age: merged.age ?? -1,
			gender: gender as keyof typeof Gender,

			availability: merged.availableDays ?? [],
			location: merged.suburb ?? '',
			gymLocation: merged.gym ?? '',

			certifications: [
				...(formState.experience?.mandatoryCertifications ?? []),
				...(formState.experience?.additionalCertifications ?? []),
				...(formState.experience?.mandatoryCertifications?.includes('Other') && formState.experience?.customCertification
					? [formState.experience.customCertification]
					: [])
			],

			experience: merged.experienceLevel ?? -1,
			bio: merged.bio ?? '',

			niche: merged.trainingStyle ?? Niche.BODYBUILDING,

			image: Array.isArray(merged.profilePhotos) ? merged.profilePhotos[0] ?? null : null,
			profilePhotos: merged.profilePhotos ?? [],
			qualifications: merged.qualifications ?? [],

			isApproved: false,
			quote: merged.quote ?? '',
			website: merged.website ?? '',
			socials: merged.socials ?? '',
			testimonials: merged.testimonials ?? '',
			resultsPhotos: merged.resultsPhotos ?? [],

			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		console.log('Item to insert into DynamoDB:', item);

		try {
			const TABLE = 'PersonalTrainer-ycmuiolpezdtdkkxmiwibhh6e4-staging';
			const client = new DynamoDBClient({
				region: process.env.EXPO_PUBLIC_AWS_REGION || 'ap-southeast-2',
				credentials: {
					accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || '',
					secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
				},
			});

			const marshalledItem = marshall(item, {
				removeUndefinedValues: true,
				convertClassInstanceToMap: true
			});

			const params = {
				TableName: TABLE,
				Item: marshalledItem
			};

			await client.send(new PutItemCommand(params));
			console.log('Item inserted into DynamoDB successfully.');

			const { setActiveUser } = useActiveUserStore.getState();
			setActiveUser({
				bio: item.bio,
				name: item.name,
				age: item.age,
				image: item.image
			});
		} catch (error) {
			console.error('Error submitting trainer application:', error);
			throw new Error('Failed to submit trainer application. Please try again.');
		}
	}
}));
