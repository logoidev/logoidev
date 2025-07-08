import { redirect } from '@sveltejs/kit';
import { getUserById } from '../../../data/users';

export function load({ params: { user: userId = '' } }) {
	const userData = getUserById(userId);

	if (!userData) {
		redirect(302, '/');
	}

	return userData;
}
