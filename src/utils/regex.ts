export function regexFromString(str: string): RegExp {
	// Escape special characters
	const specialChars = /[.*+?^=!:${}()|\[\]\/\\]/g;
	str = str.replace(specialChars, "\\$&");

	return new RegExp(str);
}

export const validContentRegex =
	/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|[a-zA-Z0-9\s\-_\/\.:äöüÄÖÜßéáíóúçñÊÈëïôû])+/g;

export function getSearchRegex(
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
