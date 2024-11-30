import { GuiService } from "@rbxts/services";

export function useTopbarStyle() {
	return GuiService.TopbarInset.Height === 36 ? "Old" : "New";
}
