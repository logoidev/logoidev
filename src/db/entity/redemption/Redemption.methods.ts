import { initialiseDb } from '../..';
import { AppDataSource } from '../../data-source';
import { RedemptionModel } from './Redemption.model';

export const createRedemption = async (redemptionData: RedemptionModel) => {
	await initialiseDb();

	const redemption = new RedemptionModel();

	for (const key of Object.keys(redemptionData)) {
		if (key !== 'id') {
			location[key] = redemptionData[key];
		}
	}

	await AppDataSource.manager.save(redemption);
	return redemption;
};
