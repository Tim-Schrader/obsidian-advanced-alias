import { App, TFile } from "obsidian";
import getFrontmatter from "./getFrontmatter";

/**
 * Get the aliases of a file.
 * @param file - The file to get the aliases from
 * @param app - The app instance
 * @param aliasKeys - The keys to search for aliases
 * @returns The aliases of the file
 */
export default function getFileAliases(
	file: TFile,
	app: App,
	aliasKeys: string[]
): string[] {
	const aliases: string[] = [];

	const frontmatter = getFrontmatter(file, app);

	if (frontmatter === undefined) return [];

	for (const key of aliasKeys) {
		if (frontmatter[key]) {
			aliases.push(...frontmatter[key]);
		}
	}

	return aliases;
}
