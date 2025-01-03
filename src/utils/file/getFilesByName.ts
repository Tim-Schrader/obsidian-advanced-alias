import { App, TFile } from "obsidian";

/**
 * Finds files in the Obsidian Vault by their name.
 *
 * @param app - The Obsidian app instance
 * @param fileName - The name of the file
 * @returns An array of TFile objects that match the name
 */
export default function getFilesByName(app: App, fileName: string): TFile[] {
	const files = app.vault.getFiles();
	const matchingFiles = files.filter((file) => file.basename === fileName);
	return matchingFiles;
}
