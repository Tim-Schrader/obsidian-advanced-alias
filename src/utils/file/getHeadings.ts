import { App, HeadingCache, TFile } from "obsidian";

/**
 * Get the headings in a file.
 * @param file - The file to get the headings from
 * @param app - The app instance
 * @returns The headings in the file
 */
export default function getHeadings(file: TFile, app: App): HeadingCache[] {
	const headings = app.metadataCache.getFileCache(file)?.headings;

	if (headings === undefined) {
		return [];
	} else {
		return headings;
	}
}
