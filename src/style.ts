import { Manager } from "@rbxts/melody";
import { SoundService } from "@rbxts/services";
import { IconProps } from "./components/icon";
import { DropdownProps } from "./components/dropdown";

function DefaultPlaySound(id: string) {
	const sound = Manager.buildSoundCreator(id)({
		Parent: SoundService,
	});
	sound.Play();
	sound.Ended.Once(() => sound.Destroy());
}

export function Noop() {}

export interface Stylesheet {
	icon: Required<IconProps>;
	dropdown: Required<DropdownProps>;
}

export const DefaultStylesheet: Stylesheet = {
	icon: {
		fontFace: new Font(
			"rbxasset://fonts/families/GothamSSm.json",
			Enum.FontWeight.Medium,
			Enum.FontStyle.Normal,
		),
		cornerRadius: new UDim(1, 0),
		textColor: {
			deselected: Color3.fromRGB(255, 255, 255),
			selected: Color3.fromRGB(57, 60, 65),
		},
		backgroundColor: {
			deselected: Color3.fromRGB(0, 0, 0),
			selected: Color3.fromRGB(245, 245, 245),
		},
		backgroundTransparency: 0.3,
		imageColor: {
			deselected: Color3.fromRGB(255, 255, 255),
			selected: Color3.fromRGB(57, 60, 65),
		},
		textSize: 20,
		imageSizeOffset: -4,
		leftClickSound: "",
		rightClickSound: "",
		playSound: DefaultPlaySound,
		imageId: "",
		imageTransparency: 0,
		layoutOrder: 0,
		text: "",
		defaultState: "deselected",
		forcedState: "deselected",
		toggleStateOnClick: true,
		selected: Noop,
		deselected: Noop,
		stateChanged: Noop,
		onClick: Noop,
		onRightClick: Noop,
		children: [],
	},
	dropdown: {
		maxWidth: 300,
		minWidth: 200,
		maxHeight: 200,
		padding: new UDim(0, 2.5),
		forceHeight: 32,
		iconCornerRadius: new UDim(0, 0),
		selectionMode: "Multiple",
		children: [],
	}
};
