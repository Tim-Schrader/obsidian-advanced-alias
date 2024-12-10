/**
 * Finds a match based on the headingAliasSearchRegex and cursor position in the current line.
 *
 * @param lineText - current line in editor
 * @param cursorPos - current cursor position
 * @returns start, end and content of the match if found, otherwise return null
 */
export default function findMatchInLine(
	lineText: string,
	cursorPos: number,
	search: {
		leftIdentifier: string;
		rightIdentifier: string;
		searchRegex: RegExp;
	}
): { start: number; end: number; validContent: string } | null {
	let match: RegExpExecArray | null;

	const searchRegexCopy = new RegExp(search.searchRegex, "g");

	// Check for all matches in the line
	while ((match = searchRegexCopy.exec(lineText)) !== null) {
		const matchStart = match.index;
		const matchEnd = matchStart + match[0].length;
        
		// Check if the cursor is inside the match
		if (cursorPos > matchStart && cursorPos < matchEnd) {
			const validContent = (match[1] === undefined) ? "" : match[1];
			const start = matchStart + search.leftIdentifier.length;
			const end = matchEnd - search.rightIdentifier.length;

			return { start, end, validContent };
		}
	}

	// No match found
	return null;
}
