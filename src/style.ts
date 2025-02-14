import { Manager } from "@rbxts/melody";
import { SoundService } from "@rbxts/services";

function DefaultPlaySound(id: string) {
	const sound = Manager.buildSoundCreator(id)({
		Parent: SoundService,
	});
	sound.Play();
	sound.Ended.Once(() => sound.Destroy());
}

export const DefaultStylesheet = {
	Old: {
		Icon: {
			FontFace: new Font(
				"rbxasset://fonts/families/GothamSSm.json",
				Enum.FontWeight.Medium,
				Enum.FontStyle.Normal,
			),
			CornerRadius: new UDim(0.25, 0),
			TextColor3: {
				Deselected: Color3.fromRGB(255, 255, 255),
				Selected: Color3.fromRGB(57, 60, 65),
			},
			BackgroundColor3: {
				Deselected: Color3.fromRGB(0, 0, 0),
				Selected: Color3.fromRGB(245, 245, 245),
			},
			BackgroundTransparency: {
				Deselected: 0.5,
				Selected: 0.1,
			},
			ImageColor3: {
				Deselected: Color3.fromRGB(255, 255, 255),
				Selected: Color3.fromRGB(57, 60, 65),
			},
			TextSize: 17,
			ImageSizeOffset: 0,
			Sound: "",
			PlaySound: DefaultPlaySound,
		},
		Dropdown: {
			DefaultMaxWidth: 300,
			DefaultMinWidth: 200,
			DefaultMaxHeight: 200,
			Padding: new UDim(0, 2.5),
			ForceHeight: undefined,
			IconCornerRadius: new UDim(0, 0),
		},
	},
	New: {
		Icon: {
			FontFace: new Font(
				"rbxasset://fonts/families/GothamSSm.json",
				Enum.FontWeight.Medium,
				Enum.FontStyle.Normal,
			),
			CornerRadius: new UDim(1, 0),
			TextColor3: {
				Deselected: Color3.fromRGB(255, 255, 255),
				Selected: Color3.fromRGB(57, 60, 65),
			},
			BackgroundColor3: {
				Deselected: Color3.fromRGB(0, 0, 0),
				Selected: Color3.fromRGB(245, 245, 245),
			},
			BackgroundTransparency: 0.3,
			ImageColor3: {
				Deselected: Color3.fromRGB(255, 255, 255),
				Selected: Color3.fromRGB(57, 60, 65),
			},
			TextSize: 20,
			ImageSizeOffset: -4,
			Sound: "",
			PlaySound: DefaultPlaySound,
		},
		Dropdown: {
			DefaultMaxWidth: 300,
			DefaultMinWidth: 200,
			DefaultMaxHeight: 200,
			Padding: new UDim(0, 2.5),
			ForceHeight: 32,
			IconCornerRadius: new UDim(0, 0),
		},
	},
};

export type Stylesheet = typeof DefaultStylesheet;
