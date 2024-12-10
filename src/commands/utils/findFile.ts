import { App, TFile } from "obsidian";

/**
 * Finds a file in the Obsidian Vault by its name or path.
 *
 * @param app - The Obsidian app instance
 * @param input - The string input (filename or full path)
 * @returns The TFile object if the file is found, or null if not
 */
export default function findFile(app: App, input: string): TFile | null {
	// Check if the input matches a full path in the Vault
	const fileByPath = app.vault.getAbstractFileByPath(input);
	if (fileByPath instanceof TFile) {
		return fileByPath; // Found the file by full path
	}

	// If not a full path, treat it as a filename and search in all markdown files
	const files = app.vault.getMarkdownFiles();
	for (const file of files) {
		if (file.basename === input) {
			return file; // Found the file by its name
		}
	}

	return null;
};
