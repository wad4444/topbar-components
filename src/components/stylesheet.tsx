import React from "@rbxts/react";
import { StylesheetContext } from "../context";
import { DefaultStylesheet, Stylesheet as StylesheetType } from "../style";
import { mergeNested } from "../utilities/merge";
import { DeepPartial } from "../utilities/types";

interface Props extends React.PropsWithChildren {
	Stylesheet: PartialStylesheet;
}
type PartialStylesheet = DeepPartial<StylesheetType>;

export function Stylesheet({ Stylesheet, children }: Props) {
	return (
		<StylesheetContext.Provider
			value={mergeNested(DefaultStylesheet, Stylesheet) as StylesheetType}
		>
			{children}
		</StylesheetContext.Provider>
	);
}
