import { App, Notice, TFile } from "obsidian";
import splitPathAndFile from "./splitPathAndName";
import getFileFromList from "./getFileFromList";
import getFilesByName from "./getFilesByName";

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

	const { path, fileName } = splitPathAndFile(input);

	if (path === null) {
		const matchingFiles = getFilesByName(app, fileName);
		if (matchingFiles.length === 0) {
			new Notice(`File ${fileName} not found!`);
			return null;
		} else if (matchingFiles.length === 1) {
			return matchingFiles[0];
		} else {
			new Notice(
				`Multiple files found with name ${fileName}!\nPlease specify the full path of the file.`
			);
			return null;
		}
	} else {
		const formattedPath = path.endsWith("/") ? path.slice(0, -1) : path;
		const folder = app.vault.getFolderByPath(formattedPath);
		if (folder === null) {
			new Notice(`Folder ${path} not found!`);
			return null;
		}

		const files = folder.children
			.filter((file) => file instanceof TFile)
			.map((file) => file as TFile);
		const file = getFileFromList(files, fileName);
		if (file === null) {
			new Notice(`File ${fileName} not found in folder ${path}!`);
			return null;
		} else {
			return file;
		}
	}
}
