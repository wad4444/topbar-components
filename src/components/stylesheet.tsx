import React from "@rbxts/react";
import { StylesheetContext } from "../context";
import { DefaultStylesheet, Stylesheet as StylesheetType } from "../style";
import { DeepPartial } from "../utilities/types";
import reconcile from "../utilities/merge";

interface Props extends React.PropsWithChildren {
	stylesheet: PartialStylesheet;
}
type PartialStylesheet = DeepPartial<StylesheetType>;

export function Stylesheet({ stylesheet, children }: Props) {
	return (
		<StylesheetContext.Provider
			value={reconcile(stylesheet, DefaultStylesheet) as StylesheetType}
		>
			{children}
		</StylesheetContext.Provider>
	);
}
