import {
	mapBinding,
	useMotion,
	useMountEffect,
} from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import { LocationContext, useLocation, useStylesheet } from "../context";
import { IconId } from "./icon";
import { SelectionMode } from "./provider";

export interface DropdownProps extends React.PropsWithChildren {
	minWidth?: number;
	maxHeight?: number;
	maxWidth?: number;
	padding?: UDim;
	forceHeight?: number;
	iconCornerRadius?: UDim;
	selectionMode?: SelectionMode;
}

export function Dropdown(componentProps: DropdownProps) {
	const location = useLocation();
	const stylesheet = useStylesheet().dropdown;
	const [selectedIcons, setSelectedIcons] = useState<IconId[]>([]);
	const [contents, setContents] = useState(new Map<number, Vector2>());

	assert(location.type === "icon", "Dropdowns can only be located under icons");
	const [transition, transitionMotion] = useMotion(location.isVisible ? 1 : 0);

	const props = { ...stylesheet, ...componentProps };
	const isNested = location.isUnderDropdown;
	const maxWidth = isNested ? location.width : props.maxWidth;
	const minWidth = isNested ? location.width : props.minWidth;
	const maxHeight = props.maxHeight;
	const scrollWidth = 5;

	const contentSize = useMemo(() => {
		let y = 0;
		let x = minWidth;
		for (const [_, size] of contents) {
			x = math.min(maxWidth, math.max(x, size.X));
			y += size.Y + stylesheet.padding.Offset;
		}

		return new Vector2(x, y);
	}, [contents, maxWidth, minWidth, stylesheet.padding.Offset]);

	useEffect(() => {
		location.setAnimationState(true);
		transitionMotion.linear(location.isVisible ? 1 : 0, { speed: 10 });
	}, [location.isVisible]);

	useMountEffect(() =>
		transitionMotion.onComplete(() => location.setAnimationState(false)),
	);

	useEffect(() => {
		location.setContentSize(contentSize);
	}, [contentSize, location.setContentSize]);

	const scrollingEnabled = !isNested && contentSize.Y > maxHeight;
	return (
		<LocationContext.Provider
			value={{
				type: "dropdown",
				selectedIcons: selectedIcons,
				iconSelected: (iconId) => {
					if (props.selectionMode === "Single") {
						return setSelectedIcons([iconId]);
					}
					return setSelectedIcons((icons) => [...icons, iconId]);
				},
				iconDeselected: (iconId) => {
					if (
						props.selectionMode === "Single" &&
						selectedIcons.includes(iconId)
					) {
						return setSelectedIcons([]);
					}
					return setSelectedIcons((icons) => icons.filter((T) => T !== iconId));
				},
				registerChild: (id, size) => {
					setContents((contents) => new Map([...contents, [id, size]]));
				},
				removeChild: (id) => {
					setContents(
						(contents) => new Map([...contents].filter((T) => T[0] !== id)),
					);
				},
				desiredIconWidth: isNested ? location.width : contentSize.X,
			}}
		>
			<scrollingframe
				ClipsDescendants={true}
				Size={mapBinding(transition, (t) =>
					UDim2.fromOffset(
						contentSize.X + (scrollingEnabled ? scrollWidth : 0),
						t * math.min(contentSize.Y, isNested ? contentSize.Y : maxHeight),
					),
				)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0, 1)}
				ScrollBarImageTransparency={
					scrollingEnabled && location.isVisible ? 0 : 1
				}
				ScrollingEnabled={scrollingEnabled}
				AutomaticCanvasSize={Enum.AutomaticSize.None}
				CanvasSize={UDim2.fromOffset(0, contentSize.Y)}
				ScrollBarThickness={scrollingEnabled ? scrollWidth : 0}
				BackgroundTransparency={1}
				Change={{
					AbsoluteSize: (rbx) => location.setDropdownSize(rbx.AbsoluteSize),
				}}
				key={"Dropdown"}
			>
				{props.children}
				{isNested && <uipadding key={"UIPadding"} PaddingTop={stylesheet.padding} />}
				<uilistlayout
					key={"UIListLayout"}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={stylesheet.padding}
				/>
			</scrollingframe>
		</LocationContext.Provider>
	);
}
