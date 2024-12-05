export const DefaultStylesheet = {
	Old: {
		Icon: {
			Font: Enum.Font.GothamSemibold as Enum.Font,
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
			TextSize: 20,
		},
		Dropdown: {
			DefaultMaxWidth: 300,
			DefaultMinWidth: 200,
			DefaultMaxHeight: 200,
			IconCornerRadius: new UDim(0.25, 0),
		},
	},
	New: {
		Icon: {
			Font: Enum.Font.GothamSemibold as Enum.Font,
			CornerRadius: new UDim(1, 0),
			TextColor3: {
				Deselected: Color3.fromRGB(255, 255, 255),
				Selected: Color3.fromRGB(57, 60, 65),
			},
			BackgroundColor3: {
				Deselected: Color3.fromRGB(0, 0, 0),
				Selected: Color3.fromRGB(245, 245, 245),
			},
			BackgroundTransparency: 0.2,
			ImageColor3: {
				Deselected: Color3.fromRGB(255, 255, 255),
				Selected: Color3.fromRGB(57, 60, 65),
			},
			TextSize: 20,
		},
		Dropdown: {
			DefaultMaxWidth: 300,
			DefaultMinWidth: 200,
			DefaultMaxHeight: 200,
			IconCornerRadius: new UDim(0.4, 0),
		},
	},
};

export type Stylesheet = typeof DefaultStylesheet;
