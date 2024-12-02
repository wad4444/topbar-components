import React from "@rbxts/react";
import { StylesheetContext } from "../context";
import { DefaultStylesheet, Stylesheet as StylesheetType } from "../style";
import { DeepPartial } from "../utilities/types";

interface Props extends React.PropsWithChildren {
	Stylesheet: PartialStylesheet;
}
type PartialStylesheet = DeepPartial<StylesheetType>;

function mergeNested(base: object, from: object) {
	const cloned = table.clone(base);
	for (const [key, value] of pairs(from)) {
		if (typeIs(value, "table")) {
			cloned[key as never] = mergeNested(base[key as never], value) as never;
		}
		cloned[key as never] = value as never;
	}

	return cloned;
}

export function Stylesheet({ Stylesheet, children }: Props) {
	return (
		<StylesheetContext.Provider
			value={mergeNested(DefaultStylesheet, Stylesheet) as StylesheetType}
		>
			{children}
		</StylesheetContext.Provider>
	);
}
