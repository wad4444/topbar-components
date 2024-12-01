import { Binding, createContext, useContext } from "@rbxts/react";
import { IconId } from "./components/icon";
import { DefaultStylesheet, Stylesheet } from "./style";

type Location =
	| {
			Type: "Provider";
			SelectedIcons: IconId[];
			IconSelected: (icon: IconId) => void;
			IconDeselected: (icon: IconId) => void;
	  }
	| {
			Type: "Icon";
			IsVisible: boolean;
			IsUnderDropdown: boolean;
			Width: number;
			SetDropdownSize: (current: Vector2) => void;
	  }
	| {
			Type: "Dropdown";
			SelectedIcons: IconId[];
			IconSelected: (icon: IconId) => void;
			IconDeselected: (icon: IconId) => void;
			RegisterChild: (id: number, size: Vector2) => void;
			RemoveChild: (id: number) => void;
			DesiredIconWidth: number;
	  };

export const LocationContext = createContext<Location>(undefined as never);
export const StylesheetContext = createContext<Stylesheet>(undefined as never);

export function useStylesheet() {
	return useContext(StylesheetContext) ?? DefaultStylesheet;
}

export function useLocation() {
	return useContext(LocationContext);
}
