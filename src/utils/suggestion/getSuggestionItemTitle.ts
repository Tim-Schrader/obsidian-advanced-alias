import { LinkSuggestionValueInterface } from "src/suggestion/LinkSuggestion";

/**
 * Get the title of a suggestion item.
 * @param suggestionValue - The suggestion value to get the title from
 * @returns The title of the suggestion item
 */
export default function getSuggestionItemTitle(
	suggestionValue: LinkSuggestionValueInterface
): string {
	const { alias, heading, file } = suggestionValue;

	if (alias !== null) {
		return alias;
	} else if (heading !== null) {
		return heading.text;
	} else {
		return file.name;
	}
}
