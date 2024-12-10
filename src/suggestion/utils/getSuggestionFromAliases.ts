import { AllSuggestionValueInterface } from "../AllLinkSuggestion";

/**
 * Creates a list of alias suggestions with an alias matching the query.
 *
 * @private
 * @param headingAliases alias value of the frontmatter
 * @param query string inside the search
 * @param fileName filename of the file from whose frontmatter the heading alias is obtained
 * @returns list of suggestions
 */
export function getSuggestionsFromAliases(
	aliases: string[] | string,
	query: string,
	fileName: string
): AllSuggestionValueInterface[] {
	const suggestions = new Set<AllSuggestionValueInterface>();

	/**
	 * Adds the suggestion to the set if its alias contains the query
	 *
	 * @param alias
	 */
	const addSuggestion = (alias: string) => {
		if (alias.toLowerCase().includes(query)) {
			suggestions.add({
				alias: alias,
				heading: null,
				file: fileName,
			});
		}
	};

	if (Array.isArray(aliases)) {
		aliases.forEach((alias) => {
			addSuggestion(alias);
		});
	} else if (typeof aliases === "object") {
		addSuggestion(aliases);
	}

	return Array.from(suggestions);
}