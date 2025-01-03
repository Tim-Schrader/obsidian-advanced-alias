import { App, TFile } from "obsidian";
import { LinkSuggestionValueInterface } from "../../suggestion/LinkSuggestion";
import getFilePath from "../file/getFilePath";
import getHeadingAliases from "../file/getHeadingAliases";

/**
 * Get matching heading aliases from the given query.
 * @param files - Files that are searched
 * @param query - The heading aliases to be queried
 * @param ignoreCase - Should the search be case insensitive
 * @param headingAliasKeys - The keys to search for heading aliases
 * @param app - The app instance
 * @returns The matching heading aliases as suggestion values
 */
export default function getMatchingHeadingAliases(
	files: TFile[],
	query: string,
	ignoreCase: boolean,
	headingAliasKeys: string[],
	app: App
): LinkSuggestionValueInterface[] {
	const matchingHeadingAliases: LinkSuggestionValueInterface[] = [];

	files.forEach((file) => {
		const headingAliases = getHeadingAliases(file, app, headingAliasKeys);

		headingAliases.forEach((headingAlias) => {
			let aliasText = headingAlias.alias;

			if (ignoreCase) {
				query = query.toLowerCase();
				aliasText = aliasText.toLowerCase();
			}

			if (aliasText.includes(query)) {
				matchingHeadingAliases.push({
					alias: headingAlias.alias,
					heading: {
						text: headingAlias.heading,
						level: headingAlias.level,
					},
					file: { name: file.basename, path: getFilePath(file) },
				});
			}
		});
	});

	return matchingHeadingAliases;
}
