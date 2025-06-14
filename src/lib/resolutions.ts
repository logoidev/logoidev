import type { Resolution } from '$lib/types';

export const resolutions: Resolution[] = [
	{
		id: 'infrastructure-purchase-approval',
		metadata: {
			title: 'Approval of Corporate Server Infrastructure Purchase',
			date: '2024-06-13',
			location: 'Kitchener, Ontario, Canada'
		}
	}
];

export function getResolutionById(id: string): Resolution | null {
	return resolutions.find((resolution) => resolution.id === id) ?? null;
}
