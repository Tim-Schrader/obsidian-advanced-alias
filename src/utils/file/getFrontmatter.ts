import { App, TFile } from "obsidian";

/**
 * Get the frontmatter of a file.
 * @param file - The file to get the frontmatter from
 * @param app - The app instance
 * @returns The frontmatter of the file
 */
export default function getFrontmatter(file: TFile, app: App) {
	const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
	return frontmatter;
}
