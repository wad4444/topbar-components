import { mapBinding, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import { LocationContext, useLocation, useStylesheet } from "../context";
import { useTopbarStyle } from "../hooks/use-topbar-style";
import { IconId } from "./icon";
import { SelectionMode } from "./provider";

interface DropdownProps extends React.PropsWithChildren {
	MinWidth?: number;
	MaxHeight?: number;
	MaxWidth?: number;
	SelectionMode?: SelectionMode;
}

export function Dropdown({
	MinWidth,
	MaxHeight,
	MaxWidth,
	SelectionMode = "Multiple",
	children,
}: DropdownProps) {
	const location = useLocation();
	const style = useTopbarStyle();
	const stylesheet = useStylesheet()[style].Dropdown;
	const [selectedIcons, setSelectedIcons] = useState<IconId[]>([]);
	const [contents, setContents] = useState(new Map<number, Vector2>());

	assert(location.Type === "Icon", "Dropdowns can only be located under icons");
	const [transition, transitionMotion] = useMotion(location.IsVisible ? 1 : 0);

	const isNested = location.IsUnderDropdown;
	const maxWidth = isNested
		? location.Width
		: (MaxWidth ?? stylesheet.DefaultMaxWidth);
	const minWidth = isNested
		? location.Width
		: (MinWidth ?? stylesheet.DefaultMinWidth);
	const maxHeight = MaxHeight ?? stylesheet.DefaultMaxHeight;
	const SCROLL_WIDTH = 5;

	const contentSize = useMemo(() => {
		let y = 0;
		let x = minWidth;
		for (const [_, size] of contents) {
			x = math.min(maxWidth, math.max(x, size.X));
			y += size.Y;
		}

		return new Vector2(x, y);
	}, [contents, maxWidth, minWidth]);

	useEffect(() => {
		transitionMotion.linear(location.IsVisible ? 1 : 0, { speed: 10 });
	}, [location.IsVisible]);

	const scrollingEnabled = contentSize.Y > maxHeight;
	return (
		<LocationContext.Provider
			value={{
				Type: "Dropdown",
				SelectedIcons: selectedIcons,
				IconSelected: (iconId) => {
					if (SelectionMode === "Single") {
						return setSelectedIcons([iconId]);
					}
					return setSelectedIcons((icons) => [...icons, iconId]);
				},
				IconDeselected: (iconId) => {
					if (SelectionMode === "Single" && selectedIcons.includes(iconId)) {
						return setSelectedIcons([]);
					}
					return setSelectedIcons((icons) => icons.filter((T) => T !== iconId));
				},
				RegisterChild: (id, size) => {
					setContents((contents) => new Map([...contents, [id, size]]));
				},
				RemoveChild: (id) => {
					setContents(
						(contents) => new Map([...contents].filter((T) => T[0] !== id)),
					);
				},
				DesiredIconWidth: isNested ? location.Width : contentSize.X,
			}}
		>
			<scrollingframe
				ClipsDescendants={true}
				Size={mapBinding(transition, (t) =>
					UDim2.fromOffset(
						contentSize.X + (scrollingEnabled ? SCROLL_WIDTH : 0),
						t * math.min(contentSize.Y, maxHeight),
					),
				)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0, 1)}
				Change={{
					AbsoluteSize: (rbx) => location.SetDropdownSize(rbx.AbsoluteSize),
				}}
				ScrollBarImageTransparency={
					scrollingEnabled && location.IsVisible ? 0 : 1
				}
				ScrollingEnabled={scrollingEnabled}
				AutomaticCanvasSize={Enum.AutomaticSize.None}
				CanvasSize={UDim2.fromOffset(0, contentSize.Y)}
				ScrollBarThickness={scrollingEnabled ? SCROLL_WIDTH : 0}
				BackgroundTransparency={1}
				key={"Dropdown"}
			>
				{children}
				<uilistlayout key={"UIListLayout"} Padding={stylesheet.Padding} />
			</scrollingframe>
		</LocationContext.Provider>
	);
}
