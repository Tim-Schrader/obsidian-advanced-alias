/**
 * Converts a string into a regular expression.
 *
 * @param str - The string to convert into a regular expression
 * @returns A regular expression object
 */
export default function regexFromString(str: string): RegExp {
	// Escape special characters
	const specialChars = /[.*+?^=!:${}()|\[\]\/\\]/g;
	str = str.replace(specialChars, "\\$&");

	return new RegExp(str);
}
