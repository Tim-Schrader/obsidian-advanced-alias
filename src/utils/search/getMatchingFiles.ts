import { TFile } from "obsidian";
import { LinkSuggestionValueInterface } from "../../suggestion/LinkSuggestion";
import getFilePath from "../file/getFilePath";

/**
 * Get matching files from the given query.
 * @param files - Files that are searched
 * @param query - The file name to be queried
 * @param ignoreCase - Should the search be case insensitive
 * @returns The matching files as suggestion values
 */
export default function getMatchingFiles(
	files: TFile[],
	query: string,
	ignoreCase: boolean
): LinkSuggestionValueInterface[] {
	console.log("test");

	const matchingFiles: LinkSuggestionValueInterface[] = [];

	files.forEach((file) => {
		let fileName = file.basename;

		if (ignoreCase) {
			query = query.toLowerCase();
			fileName = fileName.toLowerCase();
		}

		if (fileName.includes(query)) {
			matchingFiles.push({
				alias: null,
				heading: null,
				file: { name: file.basename, path: getFilePath(file) },
			});
		}
	});

	return matchingFiles;
}
