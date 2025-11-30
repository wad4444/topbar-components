import { t } from "@rbxts/t";
import { IconState, StateDependent } from "../components/icon";

const state_check: t.check<IconState> = t.union(
	t.literal("selected"),
	t.literal("deselected"),
);
const object_check: t.check<Record<IconState, any>> = t.interface({
	selected: t.any,
	deselected: t.any,
});

export function stateful<T>(value: StateDependent<T>, state: IconState): T {
	assert(state_check(state), `Cannot resolve invalid state: ${state}`);
	return object_check(value) ? value[state] : value;
}
