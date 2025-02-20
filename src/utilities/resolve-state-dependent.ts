import { t } from "@rbxts/t";
import { IconState, StateDependent } from "../components/icon";

const check: t.check<Record<IconState, any>> = t.interface({
	selected: t.any,
	deselected: t.any,
});

export function stateful<T>(value: StateDependent<T>, state: IconState): T {
	return check(value) ? value[state] : value;
}
