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
	heading: {
		text: string;
		level: number;
	},
	alias: string
): void {
	filemanager.processFrontMatter(
		file,
		(frontmatter: {
			["heading-aliases"]:
				| { heading: string; alias: string; level: number }[]
				| undefined;
		}) => {
			if (!frontmatter["heading-aliases"]) {
				frontmatter["heading-aliases"] = [];
			}
			if (
				!frontmatter["heading-aliases"].some(
					(headingAlias) =>
						headingAlias.heading === heading.text &&
						headingAlias.alias === alias &&
						headingAlias.level === heading.level
				)
			) {
				frontmatter["heading-aliases"].push({
					heading: heading.text,
					alias,
					level: heading.level,
				});
				new Notice("Alias added");
			} else {
				new Notice("Alias already exists");
			}
		}
	);
}
