import { LinkSuggestionValueInterface } from "src/suggestion/LinkSuggestion";

type SuggestionItemAux = {
	alias: boolean;
	heading: number | null;
};

/**
 * Get the aux of a suggestion item.
 * @param suggestionValue - The suggestion value to get the aux from
 * @returns The aux of the suggestion item
 */
export default function getSuggestionItemAux(
	suggestionValue: LinkSuggestionValueInterface
): SuggestionItemAux {
	const { alias, heading } = suggestionValue;

	const aliasAux = alias !== null;
	const headingAux = heading === null ? null : heading.level;

	const aux: SuggestionItemAux = {
		alias: aliasAux,
		heading: headingAux,
	};

	return aux;
}
