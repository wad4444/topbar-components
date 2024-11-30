import React from "@rbxts/react";
import { StylesheetContext } from "../context";
import { DefaultStylesheet, Stylesheet as StylesheetType } from "../style";

interface Props extends React.PropsWithChildren {
	Stylesheet: Partial<StylesheetType>;
}

export function Stylesheet({ Stylesheet, children }: Props) {
	return (
		<StylesheetContext.Provider value={{ ...Stylesheet, ...DefaultStylesheet }}>
			{children}
		</StylesheetContext.Provider>
	);
}
