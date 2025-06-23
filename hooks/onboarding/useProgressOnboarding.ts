import { useEffect } from 'react';
import { usePathname } from 'expo-router';

// Workflows defined like below so it can track progress easily
// Just follow the use-cases
// Must be in flow order otherwise progress value will not flow correctly
export const onboardingRoutes = {
	welcome: [
		'/onboarding/welcome/start',
		'/onboarding/welcome/help',
		'/onboarding/welcome/get-started',
		'/onboarding/welcome/gender',
		'/onboarding/welcome/role'
	],

	trainer: [
		'/onboarding/trainer/start',
		'/onboarding/trainer/training-style',
		'/onboarding/trainer/location',
		'/onboarding/trainer/about-you',
		'/onboarding/trainer/experience',
		'/onboarding/trainer/personality',
		'/onboarding/trainer/results',
		'/onboarding/trainer/qualifications',
		'/onboarding/trainer/payment',
		'/onboarding/trainer/submit',
	],

	client: [
		'/onboarding/client/profile/start', 
		'/onboarding/client/profile/choice', 
		'/onboarding/client/profile/info',
		'/onboarding/client/profile/goals',
		'/onboarding/client/profile/preference'
  ],

  	clientOnline: [
		'/onboarding/client/online/availability',
		'/onboarding/client/online/experience',
		'/onboarding/client/online/match',
	],

	clientInperson: [
		'/onboarding/client/inPerson/location',
		'/onboarding/client/inPerson/matchLocation',
	],

	clientMatch: [
		'/onboarding/client/trainerDetails',
		'/onboarding/client/selectedTrainer'
	]


};

// Uses the usePathname expo-router hook -> Inside a use-effect, whenever path changes trigger the use-effect
export const useProgressOnboarding = (setProgress: (value: number) => void) => {
	const pathname = usePathname();

	useEffect(() => {
		let progress = 0;

    // in Welcome phase
		if (onboardingRoutes.welcome.includes(pathname)) {
			const index = onboardingRoutes.welcome.indexOf(pathname);
			progress = ((index + 1) / onboardingRoutes.welcome.length) * 50;
		} 
    
    // in Trainer flow
    else if (onboardingRoutes.trainer.includes(pathname)) {
			const index = onboardingRoutes.trainer.indexOf(pathname);
			progress = 50 + ((index + 1) / onboardingRoutes.trainer.length) * 50;
		} 
    
    // in Client flow
    else if (onboardingRoutes.client.includes(pathname)) {
			const index = onboardingRoutes.client.indexOf(pathname);
			progress = 50 + ((index + 1) / onboardingRoutes.client.length) * 50;
		} 

	 // Online Client flow
	 else if (onboardingRoutes.clientOnline.includes(pathname)) {
		const index = onboardingRoutes.clientOnline.indexOf(pathname);
		progress = 50 + ((index + 1) / onboardingRoutes.clientOnline.length) * 50;
	}
	
	// In Person Client flow
	else if (onboardingRoutes.clientInperson.includes(pathname)) {
		const index = onboardingRoutes.clientInperson.indexOf(pathname);
		progress = 50 + ((index + 1) / onboardingRoutes.clientInperson.length) * 50;
	}

	// Client Match flow
	else if (onboardingRoutes.clientMatch.includes(pathname)) {
		const index = onboardingRoutes.clientMatch.indexOf(pathname);
		progress = 50 + ((index + 1) / onboardingRoutes.clientMatch.length) * 50;
	}
    
    // If the path doesn't match any onboarding route, reset progress
    else {
			progress = 0;
		}

    console.log(`Updating progress to: ${progress}`)

		setProgress(progress);
	}, [pathname, setProgress]);
};
