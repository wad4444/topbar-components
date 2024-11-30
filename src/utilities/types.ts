type ContainsNominal<K> = K extends `_nominal_${string}` ? true : never;

export type DeepWritable<T> = true extends ContainsNominal<keyof T>
	? T
	: T extends EnumItem
		? T
		: T extends Map<infer K, infer V>
			? Map<K, V>
			: T extends object
				? { -readonly [K in keyof T]: DeepWritable<T[K]> }
				: T;
