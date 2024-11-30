import { t } from "@rbxts/t";
import { IconState, StateDependent } from "../components/icon";

const check: t.check<Record<IconState, any>> = t.interface({
	Selected: t.any,
	Deselected: t.any,
});

export function resolveStateDependent<T>(
	value: StateDependent<T>,
	state: IconState,
): T {
	return check(value) ? value[state] : value;
}
