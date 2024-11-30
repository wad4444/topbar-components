import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";
import { GuiService } from "@rbxts/services";

export function useGuiInset() {
	const [inset, setInset] = useState(GuiService.TopbarInset);
	useEventListener(GuiService.GetPropertyChangedSignal("TopbarInset"), () =>
		setInset(GuiService.TopbarInset),
	);

	return inset;
}
