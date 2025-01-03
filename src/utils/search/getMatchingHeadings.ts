import { App, TFile } from "obsidian";
import { LinkSuggestionValueInterface } from "../../suggestion/LinkSuggestion";
import getFilePath from "../file/getFilePath";
import getHeadings from "../file/getHeadings";

/**
 * Get matching headings from the given query.
 * @param files - Files that are searched
 * @param query - The heading to be queried
 * @param ignoreCase - Should the search be case insensitive
 * @param app - The app instance
 * @returns The matching headings as suggestion values
 */
export default function getMatchingHeadings(
	files: TFile[],
	query: string,
	ignoreCase: boolean,
	app: App
): LinkSuggestionValueInterface[] {
	const matchingHeadings: LinkSuggestionValueInterface[] = [];

	files.forEach((file) => {
		const headings = getHeadings(file, app);

		if (headings === undefined) return;

		headings.forEach((heading) => {
			let headingText = heading.heading;

			if (ignoreCase) {
				query = query.toLowerCase();
				headingText = headingText.toLowerCase();
			}

			if (headingText.includes(query)) {
				matchingHeadings.push({
					alias: null,
					heading: { text: heading.heading, level: heading.level },
					file: { name: file.basename, path: getFilePath(file) },
				});
			}
		});
	});

	return matchingHeadings;
}
