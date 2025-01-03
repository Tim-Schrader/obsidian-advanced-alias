import { FileManager, Notice, TFile } from "obsidian";

/**
 * Adds an alias to the frontmatter of a file.
 *
 * @param filemanager
 * @param file - The file to add the alias to
 * @param alias - The alias to be added
 */
export default function addAlias(
	filemanager: FileManager,
	file: TFile,
	alias: string
): void {
	filemanager.processFrontMatter(file, (frontmatter) => {
		if (!frontmatter.aliases) {
			frontmatter.aliases = [];
		}
		if (!frontmatter.aliases.includes(alias)) {
			frontmatter.aliases.push(alias);
			new Notice("Alias added.");
		} else {
			new Notice("Alias already exists.");
		}
	});
}
