import { deepCopy } from "@rbxts/deepcopy";

export function mergeNested(base: object, from: object) {
	const cloned = deepCopy(base);
	for (const [key, value] of pairs(from)) {
		if (typeIs(value, "table")) {
			cloned[key as never] = mergeNested(base[key as never], value) as never;
			continue;
		}
		cloned[key as never] = value as never;
	}

	return cloned;
}
