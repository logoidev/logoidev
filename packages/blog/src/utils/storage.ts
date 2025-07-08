type StorageType = 'local' | 'session';

export class Storage<T> {
	private key: string;
	private type: StorageType;
	private storage: globalThis.Storage;
	private _value: T | null;

	constructor(key: string, type: StorageType = 'local') {
		this.key = key;
		this.type = type;
		this.storage = this.type === 'local' ? localStorage : sessionStorage;
		this._value = this.value;
	}

	get value() {
		const value = this.storage.getItem(this.key);
		this._value = value && JSON.parse(value);
		return this._value;
	}

	set value(value: T | null) {
		this._value = value;
		this.storage.setItem(this.key, JSON.stringify(value));
	}

	clear() {
		this.storage.removeItem(this.key);
	}
}
