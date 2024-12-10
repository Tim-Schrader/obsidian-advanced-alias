
/**
 * Retrieves the current link from the given line of text and cursor position.
 *
 * @param lineText - The line of text to search for links
 * @param cursorPos - The position of the cursor within the line of text
 * @returns The current link if found, or null if not found
 */
export default function getCurrentLink(
	lineText: string,
	cursorPos: number
): string | null {
	let match: RegExpExecArray | null;
	let linkStart = null;
	let linkEnd = null;

	// Regex for Obsidian links
	const regex = /\[\[.*?\]\]/g;

	while ((match = regex.exec(lineText)) !== null) {
		const matchStart = match.index;
		const matchEnd = matchStart + match[0].length;

		// Check if the cursor is inside a link
		if (cursorPos > matchStart && cursorPos < matchEnd) {
			linkStart = matchStart;
			linkEnd = matchEnd;

			break;
		}
	}

	if (linkStart == null || linkEnd == null) {
		return null;
	}

	const linkText = lineText.substring(linkStart, linkEnd);
	return linkText;
}
