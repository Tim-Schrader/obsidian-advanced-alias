import regexFromString from "./regexFromString";

export const validContentRegex =
	/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|[a-zA-Z0-9\s\-_\/\.:äöüÄÖÜßéáíóúçñÊÈëïôû])+/g;

/**
 * Get a regular expression for searching valid content between given identifier.
 *
 * @param leftIdentifier - The left identifier of the search
 * @param rightIdentifier - The right identifier of the search
 * @returns A regular expression object for searching
 */
export default function getSearchRegex(
	leftIdentifier: string,
	rightIdentifier: string
): RegExp {
	const leftRegex = regexFromString(leftIdentifier);
	const rightRegex = regexFromString(rightIdentifier);

	return new RegExp(
		`${leftRegex.source}(${validContentRegex.source})?${rightRegex.source}`,
		"g"
	);
}
