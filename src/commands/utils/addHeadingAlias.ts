import { FileManager, Notice, TFile } from "obsidian";

/**
 * Adds a heading alias to the frontmatter of a file.
 *
 * @param filemanager
 * @param file - The file to add the heading alias to
 * @param heading - The heading to alias
 * @param alias - The alias for the heading
 */
export default function addHeadingAlias(
	filemanager: FileManager,
	file: TFile,
	heading: string,
	alias: string
): void {
	filemanager.processFrontMatter(
		file,
		(frontmatter: {
			["heading-aliases"]:
				| { heading: string; alias: string }[]
				| undefined;
		}) => {
			if (!frontmatter["heading-aliases"]) {
				frontmatter["heading-aliases"] = [];
			}
			if (
				!frontmatter["heading-aliases"].some(
					(headingAlias) =>
						headingAlias.heading === heading &&
						headingAlias.alias === alias
				)
			) {
                frontmatter["heading-aliases"].push({ heading, alias})
                new Notice("Alias added");
			} else {
                new Notice("Alias already exists");
            }
		}
	);
}
