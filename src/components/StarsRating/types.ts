import { getEnumValuesArray, type GenericEnum } from '../../shared/utils';

export enum Level {
	S,
	A,
	B,
	C,
	D,
	// Should be last
	F
}

// CSS vars need to be declared with these colors
export enum Metal {
	GOLD = 'gold',
	SILVER = 'silver',
	BRONZE = 'bronze',
	TITANIUM = 'titanium',
	COPPER = 'copper',
	ALUMINUM = 'aluminum',
	STEEL = 'steel'
}

export enum PositionType {
	EXECUTIVE = 'executive',
	SENIOR = 'senior',
	MIDDLE = 'middle',
	JUNIOR = 'junior',
	APPRENTICE = 'apprentice',
	CANDIDATE = 'candidate'
}

export const METALS_BY_LEVEL: Record<Level, Metal> = {
	[Level.S]: Metal.GOLD,
	[Level.A]: Metal.SILVER,
	[Level.B]: Metal.BRONZE,
	[Level.C]: Metal.TITANIUM,
	[Level.D]: Metal.COPPER,
	[Level.F]: Metal.ALUMINUM
};

export const POSITION_TYPES_BY_LEVEL: Record<Level, PositionType> = {
	[Level.S]: PositionType.EXECUTIVE,
	[Level.A]: PositionType.SENIOR,
	[Level.B]: PositionType.MIDDLE,
	[Level.C]: PositionType.JUNIOR,
	[Level.D]: PositionType.APPRENTICE,
	[Level.F]: PositionType.CANDIDATE
};

export interface BoundingBox {
	x?: number;
	y?: number;
	width: number;
	height: number;
}

// TODO: Move to src/data

export const LEVELS_UPPERCASED = getEnumValuesArray(Level as unknown as GenericEnum).slice(0, -1);
