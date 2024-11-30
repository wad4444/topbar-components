import { useMotion, usePrevious } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { springs } from "../utilities/springs";

interface AnimateableProps {
	BackgroundColor3: Color3;
	BackgroundTransparency: number;
}
type Result = {
	[P in keyof AnimateableProps]: React.Binding<AnimateableProps[P]>;
};

export function useAnimateableProps(props: AnimateableProps): Result {
	const previousProps = usePrevious(props);
	const [color, colorMotion] = useMotion(props.BackgroundColor3);
	const [transparency, transparencyMotion] = useMotion(
		props.BackgroundTransparency,
	);

	useEffect(() => {
		if (
			props.BackgroundTransparency !== previousProps?.BackgroundTransparency
		) {
			transparencyMotion.spring(props.BackgroundTransparency, springs.responsive);
		}
		if (props.BackgroundColor3 !== previousProps?.BackgroundColor3) {
			colorMotion.spring(props.BackgroundColor3, springs.responsive);
		}
	}, [props]);

	return {
		BackgroundColor3: color,
		BackgroundTransparency: transparency,
	};
}
