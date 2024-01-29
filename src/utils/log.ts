import { SERVER_LOG } from 'src/shared/constants';

// eslint-disable-next-line
export const log = (...msg: Array<any>) => {
	if (SERVER_LOG) {
		console.log(...msg);
	}
};
