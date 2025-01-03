import { App, TFile } from "obsidian";
import getFrontmatter from "./getFrontmatter";
import { HeadingAliasesInterface } from "src/suggestion/LinkSuggestion";

/**
 * Get the heading aliases of a file.
 * @param file - The file to get the heading aliases from
 * @param app - The app instance
 * @param aliasKeys - The keys to search for heading aliases
 * @returns The heading aliases of the file
 */
export default function getHeadingAliases(
	file: TFile,
	app: App,
	headingAliasKeys: string[]
): HeadingAliasesInterface[] {
	const headingAliases: HeadingAliasesInterface[] = [];

	const frontmatter = getFrontmatter(file, app);

	if (frontmatter === undefined) return [];

	for (const key of headingAliasKeys) {
		if (frontmatter[key]) {
			headingAliases.push(...frontmatter[key]);
		}
	}
	2;
	return headingAliases;
}
