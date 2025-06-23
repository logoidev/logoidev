import { writable } from 'svelte/store';
import type { Liturgy } from '../../routes/liturgy/liturgy/liturgy.schema';
import type { Speaker } from '../../routes/liturgy/speaker/speaker';

export interface LiturgyState {
	liturgy: Liturgy | null;
	speakers: Speaker[];
	isLoading: boolean;
	isAdmin: boolean;
	isAdminView: boolean;
	editedLiturgy: Liturgy | null;
	allSpeakers: string[];
}

function createLiturgyStore() {
	const { subscribe, set, update } = writable<LiturgyState>({
		liturgy: null,
		speakers: [],
		isLoading: false,
		isAdmin: false,
		isAdminView: false,
		editedLiturgy: null,
		allSpeakers: []
	});

	// Helper functions
	function getDisplayLiturgy(state: LiturgyState): Liturgy | null {
		return state.isAdminView ? state.editedLiturgy : state.liturgy;
	}

	function getTargetLiturgy(state: LiturgyState): Liturgy | null {
		return state.isAdminView ? state.editedLiturgy : state.liturgy;
	}

	return {
		subscribe,
		set,
		update,

		// Initialize with data
		initialize: (liturgy: Liturgy, speakers: Speaker[], isAdmin: boolean = false) => {
			console.log('Store initialize called with:', { liturgy, speakers, isAdmin });
			update((state) => {
				const uniqueSpeakers = liturgy
					? [
							...new Set(
								liturgy.content.flatMap((section) =>
									section.content.map((paragraph) => paragraph.by)
								)
							)
						].sort()
					: [];

				const commonSpeakers = [
					'Priest',
					'Deacon',
					'Faithful',
					'Choir',
					'Reader',
					'All',
					'People',
					'Congregation'
				];

				const allSpeakers = liturgy
					? [...new Set([...commonSpeakers, ...uniqueSpeakers])].sort()
					: commonSpeakers;

				const newState = {
					...state,
					liturgy,
					speakers,
					isAdmin,
					allSpeakers
				};
				console.log('New store state:', newState);
				return newState;
			});
		},

		// Set loading state
		setLoading: (loading: boolean) => {
			update((state) => ({ ...state, isLoading: loading }));
		},

		// Toggle admin view
		toggleAdminView: () => {
			update((state) => {
				const newAdminView = !state.isAdminView;
				let editedLiturgy = state.editedLiturgy;

				if (newAdminView && state.liturgy) {
					editedLiturgy = JSON.parse(JSON.stringify(state.liturgy));
				}

				return {
					...state,
					isAdminView: newAdminView,
					editedLiturgy
				};
			});
		},

		// Update liturgy data (for inline editing)
		updateLiturgy: (newLiturgy: Liturgy) => {
			update((state) => ({
				...state,
				liturgy: newLiturgy
			}));
		},

		// Update edited liturgy (for admin view)
		updateEditedLiturgy: (newEditedLiturgy: Liturgy) => {
			update((state) => ({
				...state,
				editedLiturgy: newEditedLiturgy
			}));
		},

		// Reset changes
		resetChanges: (originalLiturgy: Liturgy) => {
			update((state) => {
				if (state.isAdminView) {
					return {
						...state,
						editedLiturgy: JSON.parse(JSON.stringify(originalLiturgy))
					};
				} else {
					return {
						...state,
						liturgy: JSON.parse(JSON.stringify(originalLiturgy))
					};
				}
			});
		},

		// Get current display liturgy
		getDisplayLiturgy,

		// Get target liturgy for saving
		getTargetLiturgy
	};
}

export const liturgyStore = createLiturgyStore();
