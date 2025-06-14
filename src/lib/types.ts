export interface Resolution {
	id: string;
	metadata: {
		title: string;
		date: string;
		location: string;
	};
}
export interface ResolutionWithContent extends Resolution {
	content: string;
}
