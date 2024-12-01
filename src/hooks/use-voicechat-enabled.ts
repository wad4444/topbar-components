import { useAsyncEffect } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { Players, VoiceChatService } from "@rbxts/services";

export function useVoicechatEnabled() {
	const [enabled, setEnabled] = useState(false);

	useAsyncEffect(async () => {
		setEnabled(
			VoiceChatService.IsVoiceEnabledForUserIdAsync(Players.LocalPlayer.UserId),
		);
	}, []);

	return enabled;
}
