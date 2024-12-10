import AdvancedAliasPlugin from "main";
import { Command, Editor, MarkdownView } from "obsidian";
import insertText from "./utils/insertText";

/**
 * @returns The command to insert a search for headings
 */
export default function insertHeadingSearchCommand(): Command {
	return {
		id: "insert-heading-search",
		name: "Insert heading search",
		editorCallback: (editor: Editor, view: MarkdownView) => {
			const leftText = "[[##";
			const rightText = "]]";

			insertText(editor, leftText, rightText);
		},
	};
}
