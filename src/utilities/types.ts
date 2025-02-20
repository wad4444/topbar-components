type ContainsNominal<K> = K extends `_nominal_${string}` ? true : never;

export type DeepPartial<T> = true extends ContainsNominal<keyof T>
	? T
	: T extends EnumItem
		? T
		: T extends Map<any, any>
			? T
			: T extends object
				? { [K in keyof T]?: DeepPartial<T[K]> }
				: T;
