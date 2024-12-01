import { mapBinding, useUnmountEffect } from "@rbxts/pretty-react-hooks";
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
	ImageTransparency?: StateDependent<number>;
	Text?: StateDependent<string>;
	Selected?: () => void;
	Deselected?: () => void;
	StateChanged?: (state: IconState) => void;
}

export type IconState = "Selected" | "Deselected";
export type StateDependent<T> = Partial<Record<IconState, T>> | T;
export type IconId = number;

export function Icon({
	ImageId,
	ImageColor,
	ImageTransparency,
	Selected,
	Deselected,
	StateChanged,
	BackgroundTransparency,
	BackgroundColor,
	Text,
	children,
}: IconProps) {
	const style = useTopbarStyle();
	const inset = useGuiInset();
	const location = useLocation();
	const id = useId();
	const [currentState, setState] = useState<IconState>("Deselected");
	const [dropdownSize, setDropdownSize] = useState(new Vector2(0, 0));
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

	useEffect(() => {
		StateChanged?.(currentState);
		if (currentState === "Selected") {
			location.IconSelected(id);
			Selected?.();
		} else {
			location.IconDeselected(id);
			Deselected?.();
		}
	}, [currentState]);

	useEffect(() => {
		if (currentState === "Selected" && !location.SelectedIcons.includes(id)) {
			setState("Deselected");
		}
	}, [location]);

	const currentImage = resolveStateDependent(ImageId, currentState);
	const currentText = resolveStateDependent(Text, currentState);

	const PADDING = style === "New" ? 6 : 3;
	const ICON_DIFF_Y = style === "New" ? 12 : 4;
	const IMAGE_SIZE = inset.Height - ICON_DIFF_Y - PADDING * 2;

	const TEXT_SIZE = currentText
		? TextService.GetTextSize(
				currentText,
				stylesheet.Icon.TextSize,
				stylesheet.Icon.Font,
				Vector2.one.mul(99_999),
			)
		: Vector2.zero;

	const ICON_SIZE = new Vector2(
		math.max(
			inset.Height,
			TEXT_SIZE.X +
				PADDING * 2 +
				(currentImage && TEXT_SIZE.X !== 0 ? IMAGE_SIZE + PADDING : 0),
		),
		inset.Height - ICON_DIFF_Y,
	);

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
				BackgroundTransparency={1}
				key={"IconWrapper"}
			>
				<textbutton
					{...props}
					Size={new UDim2(1, 0, 0, ICON_SIZE.Y)}
					Event={{
						MouseButton1Click: () =>
							setState(
								currentState === "Deselected" ? "Selected" : "Deselected",
							),
					}}
					Text={""}
					key={"IconButton"}
				>
					{children}
					{currentImage !== undefined && (
						<imagelabel
							key={"IconImage"}
							Size={UDim2.fromOffset(IMAGE_SIZE, IMAGE_SIZE)}
							Position={UDim2.fromOffset(PADDING, PADDING)}
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
							Font={stylesheet.Icon.Font}
							TextSize={stylesheet.Icon.TextSize}
							TextColor3={resolveStateDependent(
								stylesheet.Icon.TextColor3,
								currentState,
							)}
							TextWrapped={false}
							AnchorPoint={new Vector2(0, 0.5)}
							Size={
								new UDim2(
									0,
									currentImage
										? TEXT_SIZE.X
										: math.max(TEXT_SIZE.X, inset.Height - PADDING * 2),
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
