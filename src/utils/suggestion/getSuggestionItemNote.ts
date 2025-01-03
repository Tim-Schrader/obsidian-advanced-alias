import { LinkSuggestionValueInterface } from "src/suggestion/LinkSuggestion";

/**
 * Get the note of a suggestion item.
 * @param suggestionValue - The suggestion value to get the note from
 * @returns The note of the suggestion item
 */
export default function getSuggestionItemNote(
	suggestionValue: LinkSuggestionValueInterface
): string {
	const { alias, heading, file } = suggestionValue;

	const headingText = heading === null ? "" : "#" + heading.text;

	if (alias !== null) {
		return file.path + file.name + headingText;
	} else if (heading !== null) {
		return file.path + file.name;
	} else {
		return file.path;
	}
}
