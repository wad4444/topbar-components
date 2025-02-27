import { Manager } from "@rbxts/melody";
import { SoundService } from "@rbxts/services";
import { DropdownProps } from "./components/dropdown";
import { IconProps } from "./components/icon";

function defaultPlaySound(id: string) {
	const sound = Manager.buildSoundCreator(id)({
		Parent: SoundService,
	});
	sound.Play();
	sound.Ended.Once(() => sound.Destroy());
}

export function noop() {}

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
		strokeColor: Color3.fromRGB(0, 0, 0),
		strokeThickness: 0,
		strokeTransparency: 0,
		textAlignment: Enum.TextXAlignment.Left,
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
		richText: false,
		textSize: 20,
		imageSizeOffset: -4,
		leftClickSound: "",
		rightClickSound: "",
		playSound: defaultPlaySound,
		imageId: "",
		imageTransparency: 0,
		layoutOrder: 0,
		text: "",
		defaultState: "deselected",
		forcedState: "deselected",
		toggleStateOnClick: true,
		selected: noop,
		deselected: noop,
		stateChanged: noop,
		onClick: noop,
		onRightClick: noop,
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
		scrollBarThickness: 5,
		scrollBarTransparency: 0,
		scrollBarImageColor: new Color3(1, 1, 1),
		midImage: "rbxasset://textures/ui/Scroll/scroll-middle.png",
		topImage: "rbxasset://textures/ui/Scroll/scroll-top.png",
		bottomImage: "rbxasset://textures/ui/Scroll/scroll-bottom.png",
	},
};
