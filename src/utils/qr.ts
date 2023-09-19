import type { UserIds } from '../types/user';

export const getQrUrl = (id: UserIds, round?: boolean) => {
	const qrPath = round ? 'qr-round' : 'qr';
	return `/images/users/${qrPath}/${id}.svg`;
};
