export const getRandomIntInRange = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.ceil(max);
	return Math.round(Math.random() * (max - min) + min);
};
