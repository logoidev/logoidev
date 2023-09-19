const indexGenerator = function* () {
	for (let i = 1; true; i++) {
		yield i;
	}
};

export interface IndexGenerator extends Generator<number> {
	getIndex: (postfix?: string) => string;
}

export const makeIndexGenerator = (prefix?: string): IndexGenerator => {
	const generator = indexGenerator() as IndexGenerator;
	generator.getIndex = (postfix?: string): string => {
		const index: number = generator.next().value;
		return [prefix ?? '', index, postfix ?? ''].filter(Boolean).join('-');
	};
	return generator;
};
