import { customAlphabet } from 'nanoid';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const ID_LENGTH = 11;

const ID_VALIDATION_REGEX = new RegExp(`^([A-Z]|[0-9]){${ID_LENGTH}}$`);

export const createId = customAlphabet(alphabet, ID_LENGTH);

export const validateId = (id: string) => ID_VALIDATION_REGEX.test(id);
