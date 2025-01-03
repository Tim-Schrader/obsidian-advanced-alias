import { Notice } from "obsidian";

interface LinkPartsInterface {
	fileName: string;
	heading: {
		text: string;
		level: number;
	} | null;
	alias: string;
}

/**
 * Extracts the parts from a given link text.
 *
 * @param linkText - The link text to extract parts from
 * @returns The extracted link parts or null if its an invalid format
 */
export default function getPartsFromLink(
	linkText: string
): LinkPartsInterface | null {
	const obsidianLinkRegex =
		/\[\[([^\|\#]+)(\#(#+)?([^\|\]]+))?(\|[^\]]+)?\]\]/;

	const linkParts = obsidianLinkRegex.exec(linkText);

	if (!linkParts) {
		new Notice("Invalid link format.");
		return null;
	}

	const fileName = linkParts[1];
	const rawHeading = linkParts[2]; // Includes the entire `#Heading` section.
	const headingHashes = linkParts[3]; // Only the `###` part.
	const headingText = linkParts[4]; // The heading text after the hashes.
	const alias = linkParts[5]?.substring(1);

	let heading: { text: string; level: number } | null;
	if (rawHeading) {
		heading = {
			text: headingText || "", // Default to empty string if no text exists.
			level: (headingHashes ? headingHashes.length : 0) + 1, // Count the hashes plus the initial `#`.
		};

		if (heading?.level > 6) {
			new Notice("Maximum heading level of 6 exceeded.");
			return null;
		}
	} else {
		heading = null;
	}

	return {
		fileName: fileName,
		heading: heading,
		alias: alias,
	};
}
