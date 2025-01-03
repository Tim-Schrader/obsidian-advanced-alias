/**
 * Splits a file path and file name from the given input string.
 *
 * @param input - The input string containing the file path and file name.
 * @returns An object with the path and file name.
 */
export default function splitPathAndFile(input: string): {
	path: string | null;
	fileName: string;
} {
	const lastSlashIndex = input.lastIndexOf("/");

	if (lastSlashIndex === -1) {
		return { path: null, fileName: input };
	}

	const path = input.slice(0, lastSlashIndex + 1);
	const fileName = input.slice(lastSlashIndex + 1);

	return { path, fileName };
}
