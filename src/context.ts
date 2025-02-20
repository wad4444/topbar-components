import { createContext, useContext } from "@rbxts/react";
import { IconId } from "./components/icon";
import { DefaultStylesheet, Stylesheet } from "./style";

type Location =
	| {
			type: "provider";
			selectedIcons: IconId[];
			iconSelected: (icon: IconId) => void;
			iconDeselected: (icon: IconId) => void;
	  }
	| {
			type: "icon";
			isVisible: boolean;
			isUnderDropdown: boolean;
			width: number;
			setAnimationState: (current: boolean) => void;
			setDropdownSize: (current: Vector2) => void;
			setContentSize: (current: Vector2) => void;
	  }
	| {
			type: "dropdown";
			selectedIcons: IconId[];
			iconSelected: (icon: IconId) => void;
			iconDeselected: (icon: IconId) => void;
			registerChild: (id: number, size: Vector2) => void;
			removeChild: (id: number) => void;
			desiredIconWidth: number;
	  };

export const LocationContext = createContext<Location>(undefined!);
export const StylesheetContext = createContext<Stylesheet>(undefined!);

export function useStylesheet() {
	return useContext(StylesheetContext) ?? DefaultStylesheet;
}

export function useLocation() {
	return useContext(LocationContext);
}
