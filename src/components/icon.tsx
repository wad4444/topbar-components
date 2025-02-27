import { deepEquals } from "@rbxts/object-utils";
import {
	mapBinding,
	useAsyncEffect,
	useMountEffect,
	useUnmountEffect,
	useUpdateEffect,
} from "@rbxts/pretty-react-hooks";
import React, { useBinding, useEffect, useRef, useState } from "@rbxts/react";
import { MotionGoal } from "@rbxts/ripple";
import { TextService } from "@rbxts/services";
import { LocationContext, useLocation, useStylesheet } from "../context";
import { useAnimateableProps } from "../hooks/use-animateable-props";
import { useGuiInset } from "../hooks/use-gui-inset";
import { useId } from "../hooks/use-id";
import { noop } from "../style";
import { stateful } from "../utilities/resolve-state-dependent";

export interface IconProps extends React.PropsWithChildren {
	backgroundTransparency?: StateDependent<number>;
	backgroundColor?: StateDependent<Color3>;
	imageId?: StateDependent<string>;
	imageColor?: StateDependent<Color3>;
	textColor?: StateDependent<Color3>;
	imageTransparency?: StateDependent<number>;
	layoutOrder?: StateDependent<number>;
	text?: StateDependent<string>;
	textSize?: StateDependent<number>;
	imageSizeOffset?: StateDependent<number>;
	defaultState?: IconState;
	fontFace?: StateDependent<Font>;
	forcedState?: IconState;
	leftClickSound?: StateDependent<string>;
	rightClickSound?: StateDependent<string>;
	cornerRadius?: StateDependent<UDim>;
	strokeTransparency?: StateDependent<number>;
	strokeColor?: StateDependent<Color3>;
	strokeThickness?: StateDependent<number>;
	textAlignment?: StateDependent<Enum.TextXAlignment>;
	richText?: StateDependent<boolean>;
	toggleStateOnClick?: boolean;
	selected?: () => void;
	deselected?: () => void;
	stateChanged?: (state: IconState) => void;
	onClick?: () => void;
	onRightClick?: () => void;
	playSound?: (id: string) => void;
}

type ValidKeys = ExtractKeys<Required<IconProps>, StateDependent<MotionGoal>>;

const ANIMATEABLE = [
	"backgroundColor",
	"backgroundTransparency",
	"imageColor",
	"imageTransparency",
] as const;

export type IconState = "selected" | "deselected";
export type StateDependent<T> = Record<IconState, T> | T;
export type FromStateDependent<T> = T extends StateDependent<infer U> ? U : T;
export type IconId = number;

export function Icon({ children, ...componentProps }: IconProps) {
	const inset = useGuiInset();
	const location = useLocation();
	const id = useId();

	const [currentState, setState] = useState<IconState>(
		componentProps.forcedState ?? "deselected",
	);

	const [dropdownAnimating, setAnimationState] = useState(false);
	const [contentSize, setContentSize] = useState(new Vector2(0, 0));
	const [dropdownSize, setDropdownSize] = useBinding(new Vector2(0, 0));

	const [textBounds, setTextBounds] = useState(Vector2.zero);
	const stylesheet = useStylesheet();

	assert(location.type !== "icon", "Icons cannot be nested");

	const animatedProps = useAnimateableProps(
		currentState,
		{ ...stylesheet.icon, ...componentProps } as Required<
			Pick<IconProps, ValidKeys>
		>,
		...ANIMATEABLE,
	);

	const props = {
		...stylesheet.icon,
		...componentProps,
		...animatedProps,
	};

	useMountEffect(() => {
		props.defaultState &&
			!componentProps.forcedState &&
			setState(props.defaultState);
	});

	useEffect(() => {
		if (!componentProps.forcedState) return;
		setState(componentProps.forcedState);
	}, [componentProps.forcedState]);

	useUpdateEffect(() => {
		props.stateChanged(currentState);
		if (currentState === "selected") {
			location.iconSelected(id);
			props.selected();
		} else {
			location.iconDeselected(id);
			props.deselected();
		}
	}, [currentState]);

	useUpdateEffect(() => {
		if (currentState === "selected" && !location.selectedIcons.includes(id)) {
			setState("deselected");
		}
	}, [location.selectedIcons]);

	const currentImage = stateful(props.imageId, currentState);
	const currentText = stateful(props.text, currentState);
	const previousQueryRef = useRef<{ Font: Font; Size: number; Text: string }>();

	useAsyncEffect(async () => {
		const currentQuery = {
			Font: stateful(props.fontFace, currentState),
			Size: stateful(props.textSize, currentState),
			Text: currentText,
		};
		if (deepEquals(currentQuery, previousQueryRef.current ?? {})) return;
		if (!currentText) return setTextBounds(Vector2.zero);

		const params = new Instance("GetTextBoundsParams");
		params.Text = currentText;
		params.Font = stateful(props.fontFace, currentState);
		params.Size = stateful(props.textSize, currentState);
		params.Width = 99999;

		setTextBounds(TextService.GetTextBoundsAsync(params));
		previousQueryRef.current = currentQuery;
	}, [currentText, props.fontFace, props.textSize, currentState]);

	const imageSizeOff = stateful(props.imageSizeOffset, currentState);
	const forceHeight =
		location.type === "dropdown" ? stylesheet.dropdown.forceHeight : undefined;
	const iconHeight = forceHeight ?? inset.Height - 12;
	const imageSize = iconHeight - 6 * 2 + imageSizeOff;

	const minLabelWidth =
		location.type === "dropdown"
			? location.desiredIconWidth - 12
			: inset.Height - 6 * 2;
	const accumulatedLabelWidth = currentImage
		? textBounds.X
		: math.max(textBounds.X, minLabelWidth);

	const iconSize = new Vector2(
		math.max(
			iconHeight,
			textBounds.X +
				6 * 2 +
				(currentImage && textBounds.X !== 0 ? imageSize + 6 : 0),
		),
		iconHeight,
	);
	const imagePos = 6 + imageSizeOff * -0.5;

	const textLabelPos = new UDim2(
		0,
		currentImage ? imageSize + 6 * 2 : 6,
		0.5,
		0,
	);

	useEffect(() => {
		if (location.type !== "dropdown") return;
		const includeContents = currentState === "selected" || dropdownAnimating;
		location.registerChild(
			id,
			new Vector2(iconSize.X, iconSize.Y).add(
				new Vector2(0, includeContents ? contentSize.Y : 0),
			),
		);
	}, [currentState, contentSize.Y, dropdownAnimating, iconSize]);

	useUnmountEffect(() => {
		if (location.type !== "dropdown") return;
		location.removeChild(id);
	});

	const wrapSize = mapBinding(dropdownSize, (t) =>
		UDim2.fromOffset(
			location.type === "dropdown" ? location.desiredIconWidth : iconSize.X,
			iconSize.Y + t.Y,
		),
	);

	return (
		<LocationContext.Provider
			value={{
				type: "icon",
				isVisible: currentState === "selected",
				isUnderDropdown: location.type === "dropdown",
				width:
					location.type === "dropdown" ? location.desiredIconWidth : iconSize.X,
				setDropdownSize,
				setContentSize,
				setAnimationState,
			}}
		>
			<frame
				Size={wrapSize}
				LayoutOrder={stateful(props.layoutOrder, currentState)}
				BackgroundTransparency={1}
				key={"IconWrapper"}
			>
				<textbutton
					Size={new UDim2(1, 0, 0, iconSize.Y)}
					Event={{
						MouseButton1Click: () => {
							if (stateful(props.toggleStateOnClick, currentState)) {
								setState(
									currentState === "deselected" ? "selected" : "deselected",
								);
							}
							props.onClick();

							const soundId = stateful(props.leftClickSound, currentState);
							if (!soundId) return;
							props.playSound(soundId);
						},
						MouseButton2Click: () => {
							if (props.onRightClick === noop) return;
							props.onRightClick();

							const soundId = stateful(props.rightClickSound, currentState);
							if (!soundId) return;
							props.playSound(soundId);
						},
					}}
					Text={""}
					BackgroundTransparency={props.backgroundTransparency}
					BackgroundColor3={stateful(props.backgroundColor, currentState)}
					key={"IconButton"}
				>
					{children}
					{currentImage !== undefined && currentImage !== "" && (
						<imagelabel
							key={"IconImage"}
							Size={UDim2.fromOffset(imageSize, imageSize)}
							Position={UDim2.fromOffset(imagePos, imagePos)}
							Image={currentImage}
							BackgroundTransparency={1}
							ImageColor3={props.imageColor}
							ImageTransparency={props.imageTransparency}
						/>
					)}
					{currentText !== undefined && currentText !== "" && (
						<textlabel
							FontFace={stateful(props.fontFace, currentState)}
							TextSize={stateful(props.textSize, currentState)}
							TextColor3={stateful(props.textColor, currentState)}
							TextWrapped={false}
							AnchorPoint={new Vector2(0, 0.5)}
							Size={new UDim2(0, accumulatedLabelWidth, 0.8, 0)}
							Position={textLabelPos}
							TextXAlignment={stateful(props.textAlignment, currentState)}
							RichText={stateful(props.richText, currentState)}
							BackgroundTransparency={1}
							Text={currentText}
							key={"IconText"}
						>
							<uistroke
								key={"UIStroke"}
								Thickness={stateful(props.strokeThickness, currentState)}
								Color={stateful(props.strokeColor, currentState)}
								Transparency={stateful(props.strokeTransparency, currentState)}
							/>
						</textlabel>
					)}
					<uicorner
						key={"UICorner"}
						CornerRadius={
							location.type === "dropdown"
								? stylesheet.dropdown.iconCornerRadius
								: stateful(props.cornerRadius, currentState)
						}
					/>
				</textbutton>
			</frame>
		</LocationContext.Provider>
	);
}
