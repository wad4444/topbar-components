import Object from "@rbxts/object-utils";
import { useMotion, usePrevious } from "@rbxts/pretty-react-hooks";
import { Binding, useEffect } from "@rbxts/react";
import { Motion, MotionGoal } from "@rbxts/ripple";
import {
	FromStateDependent,
	IconProps,
	IconState,
	StateDependent,
} from "../components/icon";
import { stateful } from "../utilities/resolve-state-dependent";
import { springs } from "../utilities/springs";

type Result<
	T extends Record<string, StateDependent<MotionGoal>>,
	K extends keyof T,
> = ExcludeMembers<
	{
		[P in keyof T]: P extends K
			? Binding<NonNullable<FromStateDependent<T[P]>>>
			: undefined;
	},
	undefined
>;

export function useAnimateableProps<
	T extends Record<string, StateDependent<MotionGoal>>,
	K extends keyof T,
>(state: IconState, props: T, ...keys: K[]) {
	const previousProps = usePrevious(props);
	const motions: [Binding<MotionGoal>, Motion<MotionGoal>][] = [];

	for (const key of keys) {
		const [binding, motion] = useMotion(stateful(props[key], state));
		motions.push([binding, motion]);
	}

	useEffect(() => {
		for (const key of keys) {
			const value = stateful(props[key], state);
			const previousValue = stateful(previousProps, state);
			if (value === previousValue) continue;

			motions[keys.indexOf(key)][1].spring(value, springs.responsive);
		}
	}, [props]);

	return Object.fromEntries(
		keys.map((key) => [key, motions[keys.indexOf(key)][0]]),
	) as Result<T, K>;
}
