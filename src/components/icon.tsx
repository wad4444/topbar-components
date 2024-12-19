import {
	mapBinding,
	useAsyncEffect,
	useMountEffect,
	useUnmountEffect,
	useUpdateEffect,
} from "@rbxts/pretty-react-hooks";
import React, { useEffect, useState } from "@rbxts/react";
import { TextService } from "@rbxts/services";
import { LocationContext, useLocation, useStylesheet } from "../context";
import { useAnimateableProps } from "../hooks/use-animateable-props";
import { useGuiInset } from "../hooks/use-gui-inset";
import { useId } from "../hooks/use-id";
import { useTopbarStyle } from "../hooks/use-topbar-style";
import { resolveStateDependent } from "../utilities/resolve-state-dependent";

interface IconProps extends React.PropsWithChildren {
	BackgroundTransparency?: StateDependent<number>;
	BackgroundColor?: StateDependent<Color3>;
	ImageId?: StateDependent<string>;
	ImageColor?: StateDependent<Color3>;
	TextColor?: StateDependent<Color3>;
	ImageTransparency?: StateDependent<number>;
	LayoutOrder?: StateDependent<number>;
	Text?: StateDependent<string>;
	DefaultState?: IconState;
	State?: IconState;
	ToggleStateOnClick?: boolean;
	Selected?: () => void;
	Deselected?: () => void;
	StateChanged?: (state: IconState) => void;
	OnClick?: () => void;
	OnRightClick?: () => void;
}

export type IconState = "Selected" | "Deselected";
export type StateDependent<T> = Partial<Record<IconState, T>> | T;
export type IconId = number;

export function Icon({
	ImageId,
	ImageColor,
	TextColor,
	ImageTransparency,
	Selected,
	Deselected,
	StateChanged,
	OnClick,
	OnRightClick,
	BackgroundTransparency,
	BackgroundColor,
	DefaultState,
	LayoutOrder,
	Text,
	ToggleStateOnClick = true,
	State,
	children,
}: IconProps) {
	const style = useTopbarStyle();
	const inset = useGuiInset();
	const location = useLocation();
	const id = useId();
	const [currentState, setState] = useState<IconState>(State ?? "Deselected");
	const [dropdownSize, setDropdownSize] = useState(new Vector2(0, 0));
	const [textBounds, setTextBounds] = useState(Vector2.zero);
	const stylesheet = useStylesheet()[style];

	assert(location.Type !== "Icon", "Icons cannot be nested");

	const propsGoal = {
		BackgroundTransparency: resolveStateDependent(
			BackgroundTransparency ?? stylesheet.Icon.BackgroundTransparency,
			currentState,
		),
		BackgroundColor3: resolveStateDependent(
			BackgroundColor ?? stylesheet.Icon.BackgroundColor3,
			currentState,
		),
	};

	const props = {
		...propsGoal,
		...useAnimateableProps(propsGoal),
	};

	useMountEffect(() => {
		DefaultState && !State && setState(DefaultState);
	});

	useEffect(() => {
		if (!State) return;
		setState(State);
	}, [State]);

	useUpdateEffect(() => {
		StateChanged?.(currentState);
		if (currentState === "Selected") {
			location.IconSelected(id);
			Selected?.();
		} else {
			location.IconDeselected(id);
			Deselected?.();
		}
	}, [currentState]);

	useUpdateEffect(() => {
		if (currentState === "Selected" && !location.SelectedIcons.includes(id)) {
			setState("Deselected");
		}
	}, [location.SelectedIcons]);

	const currentImage = resolveStateDependent(ImageId, currentState);
	const currentText = resolveStateDependent(Text, currentState);

	useAsyncEffect(async () => {
		if (!currentText) return setTextBounds(Vector2.zero);

		const params = new Instance("GetTextBoundsParams");
		params.Text = currentText;
		params.Font = stylesheet.Icon.FontFace;
		params.Size = stylesheet.Icon.TextSize;
		params.Width = 99999;

		setTextBounds(TextService.GetTextBoundsAsync(params));
	}, [currentText, stylesheet]);

	const ICON_DIFF_Y = style === "New" ? 12 : 4;
	const FORCE_HEIGHT =
		location.Type === "Dropdown" ? stylesheet.Dropdown.ForceHeight : undefined;
	const ICON_HEIGHT = FORCE_HEIGHT ?? inset.Height - ICON_DIFF_Y;
	const PADDING = style === "New" ? 6 : 3;
	const IMAGE_SIZE_OFF = stylesheet.Icon.ImageSizeOffset;
	const IMAGE_SIZE = ICON_HEIGHT - PADDING * 2 + IMAGE_SIZE_OFF;

	const ICON_SIZE = new Vector2(
		math.max(
			ICON_HEIGHT,
			textBounds.X +
				PADDING * 2 +
				(currentImage && textBounds.X !== 0 ? IMAGE_SIZE + PADDING : 0),
		),
		ICON_HEIGHT,
	);
	const IMAGE_POS = PADDING + IMAGE_SIZE_OFF * -0.5;

	const textLabelPos = new UDim2(
		0,
		currentImage !== undefined ? IMAGE_SIZE + PADDING * 2 : PADDING,
		0.5,
		0,
	);

	useEffect(() => {
		if (location.Type !== "Dropdown") return;
		location.RegisterChild(
			id,
			new Vector2(ICON_SIZE.X, ICON_SIZE.Y).add(
				new Vector2(0, currentState === "Selected" ? dropdownSize.Y : 0),
			),
		);
	}, [currentState, dropdownSize.Y, ICON_SIZE]);

	useUnmountEffect(() => {
		if (location.Type !== "Dropdown") return;
		location.RemoveChild(id);
	});

	const wrapSize = new Vector2(
		location.Type === "Dropdown" ? location.DesiredIconWidth : ICON_SIZE.X,
		ICON_SIZE.Y + dropdownSize.Y,
	);

	return (
		<LocationContext.Provider
			value={{
				Type: "Icon",
				IsVisible: currentState === "Selected",
				IsUnderDropdown: location.Type === "Dropdown",
				Width:
					location.Type === "Dropdown"
						? location.DesiredIconWidth
						: ICON_SIZE.X,
				SetDropdownSize: setDropdownSize,
			}}
		>
			<frame
				Size={mapBinding(wrapSize, (t) => UDim2.fromOffset(t.X, t.Y))}
				LayoutOrder={resolveStateDependent(LayoutOrder, currentState)}
				BackgroundTransparency={1}
				key={"IconWrapper"}
			>
				<textbutton
					{...props}
					Size={new UDim2(1, 0, 0, ICON_SIZE.Y)}
					Event={{
						MouseButton1Click: () => {
							if (ToggleStateOnClick) {
								setState(
									currentState === "Deselected" ? "Selected" : "Deselected",
								);
							}
							OnClick?.();
						},
						MouseButton2Click: OnRightClick,
					}}
					Text={""}
					key={"IconButton"}
				>
					{children}
					{currentImage !== undefined && (
						<imagelabel
							key={"IconImage"}
							Size={UDim2.fromOffset(IMAGE_SIZE, IMAGE_SIZE)}
							Position={UDim2.fromOffset(IMAGE_POS, IMAGE_POS)}
							Image={currentImage}
							BackgroundTransparency={1}
							ImageColor3={resolveStateDependent(
								ImageColor ?? stylesheet.Icon.ImageColor3,
								currentState,
							)}
							ImageTransparency={resolveStateDependent(
								ImageTransparency,
								currentState,
							)}
						/>
					)}
					{currentText !== undefined && currentText !== "" && (
						<textlabel
							FontFace={stylesheet.Icon.FontFace}
							TextSize={stylesheet.Icon.TextSize}
							TextColor3={resolveStateDependent(
								TextColor ?? stylesheet.Icon.TextColor3,
								currentState,
							)}
							TextWrapped={false}
							AnchorPoint={new Vector2(0, 0.5)}
							Size={
								new UDim2(
									0,
									currentImage
										? textBounds.X
										: math.max(textBounds.X, inset.Height - PADDING * 2),
									0.8,
									0,
								)
							}
							Position={textLabelPos}
							BackgroundTransparency={1}
							Text={currentText}
							key={"IconText"}
						/>
					)}
					<uicorner
						key={"UICorner"}
						CornerRadius={
							location.Type === "Dropdown"
								? stylesheet.Dropdown.IconCornerRadius
								: stylesheet.Icon.CornerRadius
						}
					/>
				</textbutton>
			</frame>
		</LocationContext.Provider>
	);
}
