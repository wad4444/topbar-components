import { useMemo } from "@rbxts/react";
import { createIdGenerator } from "../utilities/id-gen";

const nextId = createIdGenerator();

export function useId() {
	return useMemo(() => nextId(), []);
}
