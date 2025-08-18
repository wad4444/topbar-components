import React from "@rbxts/react";
import { StylesheetContext } from "../context";
import { DefaultStylesheet, Stylesheet as StylesheetType } from "../style";
import reconcile from "../utilities/merge";
import { DeepPartial } from "../utilities/types";

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
