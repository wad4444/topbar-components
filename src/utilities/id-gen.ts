export function createIdGenerator() {
	let value = 0;
	return () => value++;
}
