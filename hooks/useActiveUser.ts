import { create } from 'zustand';

interface TrainerOnboardingStore {
	activeUser: any | null;
	setActiveUser: (user: any) => void;
}

export const useActiveUserStore = create<TrainerOnboardingStore>((set, get) => ({
	activeUser: null,
	setActiveUser: (user) => {
		set({ activeUser: user });
	}
}));
