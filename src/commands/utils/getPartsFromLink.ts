interface LinkPartsInterface {
	fileName: string;
	heading: string;
	alias: string;
}

/**
 * Extracts the parts from a given link text.
 *
 * @param linkText - The link text to extract parts from
 * @returns The extracted link parts or null if its an invalid format
 */
export default function (linkText: string): LinkPartsInterface | null {
	const obsidianLinkRegex = /\[\[([^\|\#]+)(\#[^\|\]]+)?(\|[^\]]+)?\]\]/;

	const linkParts = obsidianLinkRegex.exec(linkText);

	if (!linkParts) {
		return null;
	}

	const fileName = linkParts[1];
	const heading = linkParts[2];
	const alias = linkParts[3]?.substring(1);

	return {
		fileName: fileName,
		heading: heading,
		alias: alias,
	};
}
