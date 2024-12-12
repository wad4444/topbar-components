import React, { useState } from "@rbxts/react";
import { LocationContext } from "../context";
import { useGuiInset } from "../hooks/use-gui-inset";
import { useTopbarStyle } from "../hooks/use-topbar-style";
import { useVoicechatEnabled } from "../hooks/use-voicechat-enabled";
import { IconId } from "./icon";

export type SelectionMode = "Single" | "Multiple";

interface ProviderProps extends React.PropsWithChildren {
	SelectionMode?: SelectionMode;
	GameVoiceChatEnabled?: boolean;
}

export function TopbarProvider({
	SelectionMode = "Single",
	children,
	GameVoiceChatEnabled,
}: ProviderProps) {
	const [selectedIcons, setSelectedIcons] = useState<IconId[]>([]);
	const inset = useGuiInset();
	const style = useTopbarStyle();
	const isVCEnabledForUser = useVoicechatEnabled();

	const hasBetaLabel = GameVoiceChatEnabled && isVCEnabledForUser;
	const BETA_LABEL_SIZE_X = 16;
	let leftPadding = style === "New" ? 8 : 0;

	if (hasBetaLabel && style === "New") {
		leftPadding += BETA_LABEL_SIZE_X;
	} else if (!hasBetaLabel && style === "Old") {
		leftPadding -= BETA_LABEL_SIZE_X * 2 + 3;
	}

	return (
		<LocationContext.Provider
			value={{
				Type: "Provider",
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
			}}
		>
			<frame
				key={"TopbarProvider"}
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(inset.Width, inset.Height)}
				AnchorPoint={new Vector2(1, 0)}
				Position={UDim2.fromScale(1, 0)}
			>
				<uipadding
					key={"UIPadding"}
					PaddingLeft={new UDim(0, leftPadding)}
					PaddingRight={new UDim(0, 12)}
					PaddingTop={new UDim(0, style === "New" ? 11 : 4)}
				/>
				<uilistlayout
					key={"UIListLayout"}
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Padding={new UDim(0, 12)}
				/>
				{children}
			</frame>
		</LocationContext.Provider>
	);
}
