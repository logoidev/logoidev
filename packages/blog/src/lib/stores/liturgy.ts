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
	const liturgyStore = writable<LiturgyState>({
		liturgy: null,
		speakers: [],
		isLoading: false,
		isAdmin: false,
		isAdminView: false,
		editedLiturgy: null,
		allSpeakers: []
	});

	const { subscribe, set, update } = liturgyStore;

	function getInlineLiturgy(state: LiturgyState): Liturgy | null {
		if (!state.liturgy) return null;

		const inlineLiturgy: Liturgy = {
			...state.liturgy,
			content: state.liturgy.content.map((section) => ({
				...section,
				content: section.content.reduce(
					(acc, paragraph, index) => {
						// If this is the first paragraph, has a different speaker, or has a cross
						if (index === 0 || paragraph.by !== section.content[index - 1].by || paragraph.cross) {
							acc.push({
								...paragraph,
								by: ''
							});
						} else {
							// Combine with the previous paragraph
							const lastParagraph = acc[acc.length - 1];
							lastParagraph.text += ' ' + paragraph.text;
							// Keep the cross status if either paragraph has it
							if (paragraph.cross) {
								lastParagraph.cross = true;
							}
						}
						return acc;
					},
					[] as typeof section.content
				)
			}))
		};

		return inlineLiturgy;
	}

	type DisplayLiturgyOptions = {
		isInline?: boolean;
	};

	// Helper functions
	function getDisplayLiturgy(
		state: LiturgyState,
		{ isInline = false }: DisplayLiturgyOptions = {}
	): Liturgy | null {
		const savedLiturgy = isInline ? getInlineLiturgy(state) : state.liturgy;
		return state.isAdminView ? state.editedLiturgy : savedLiturgy;
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
