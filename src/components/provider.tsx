import React, { useState } from "@rbxts/react";
import { LocationContext } from "../context";
import { useGuiInset } from "../hooks/use-gui-inset";
import { useVoicechatEnabled } from "../hooks/use-voicechat-enabled";
import { IconId } from "./icon";

export type SelectionMode = "Single" | "Multiple";

interface ProviderProps extends React.PropsWithChildren {
	selectionMode?: SelectionMode;
	gameVoiceChatEnabled?: boolean;
}

export function TopbarProvider({
	selectionMode = "Single",
	gameVoiceChatEnabled,
	children,
}: ProviderProps) {
	const [selectedIcons, setSelectedIcons] = useState<IconId[]>([]);
	const inset = useGuiInset();
	const voiceChatEnabled = useVoicechatEnabled();

	const hasBetaLabel = gameVoiceChatEnabled && voiceChatEnabled;
	const leftPadding = hasBetaLabel ? 8 + 16 : 8;

	return (
		<LocationContext.Provider
			value={{
				type: "provider",
				selectedIcons: selectedIcons,
				iconSelected: (iconId) => {
					if (selectionMode === "Single") {
						return setSelectedIcons([iconId]);
					}
					return setSelectedIcons((icons) => [...icons, iconId]);
				},
				iconDeselected: (iconId) => {
					if (selectionMode === "Single" && selectedIcons.includes(iconId)) {
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
					PaddingTop={new UDim(0, 11)}
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
