import { HeadingLinkInterface, HeadingSuggestionValueInterface } from "../HeadingLinkSuggestion";

/**
 * Creates a list of heading alias suggestions with an alias matching the query.
 *
 * @private
 * @param headingAliases heading alias value of the frontmatter
 * @param query string inside the search
 * @param fileName filename of the file from whose frontmatter the heading alias is obtained
 * @returns list of suggestions
 */
export function getSuggestionsFromHeadingAliases(
	headingAliases: HeadingLinkInterface[] | HeadingLinkInterface,
	query: string,
	fileName: string
): HeadingSuggestionValueInterface[] {
	const suggestions = new Set<HeadingSuggestionValueInterface>();

	/**
	 * Adds the suggestion to the set if its alias contains the query
	 *
	 * @param alias
	 * @param heading
	 */
	const addSuggestion = (alias: string, heading: string) => {
		if (alias.toLowerCase().includes(query)) {
			suggestions.add({
				alias: alias,
				heading: heading,
				file: fileName,
			});
		}
	};

	if (Array.isArray(headingAliases)) {
		headingAliases.forEach((headingAlias) => {
			const alias = headingAlias.alias;
			const heading = headingAlias.heading;

			addSuggestion(alias, heading);
		});
	} else if (typeof headingAliases === "object") {
		const alias = headingAliases.alias;
		const heading = headingAliases.heading;

		addSuggestion(alias, heading);
	}

	return Array.from(suggestions);
}