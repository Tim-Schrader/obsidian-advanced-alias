import { App, TFile } from "obsidian";
import { LinkSuggestionValueInterface } from "../../suggestion/LinkSuggestion";
import getFilePath from "../file/getFilePath";
import getFileAliases from "../file/getFileAliases";

/**
 * Get matching file aliases from the given query.
 * @param files - Files that are searched
 * @param query - The file aliases to be queried
 * @param ignoreCase - Should the search be case insensitive
 * @param aliasKeys - The keys to search for file aliases
 * @param app - The app instance
 * @returns The matching file aliases as suggestion values
 */
export default function getMatchingFileAliases(
	files: TFile[],
	query: string,
	ignoreCase: boolean,
	aliasKeys: string[],
	app: App
): LinkSuggestionValueInterface[] {
	const matchingFileAliases: LinkSuggestionValueInterface[] = [];

	files.forEach((file) => {
		const fileAliases = getFileAliases(file, app, aliasKeys);

		fileAliases.forEach((fileAlias) => {
			const aliasText = fileAlias;

			if (ignoreCase) {
				query = query.toLowerCase();
				fileAlias = fileAlias.toLowerCase();
			}

			if (fileAlias.includes(query)) {
				matchingFileAliases.push({
					alias: aliasText,
					heading: null,
					file: { name: file.basename, path: getFilePath(file) },
				});
			}
		});
	});

	return matchingFileAliases;
}
