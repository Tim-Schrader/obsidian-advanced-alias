import AdvancedAliasPlugin from "main";
import { Command, Editor, MarkdownView } from "obsidian";
import insertText from "./utils/insertText";

/**
 * @returns The command to insert a search for all files and their aliases
 */
export default function insertFileSearchCommand(): Command {
	return {
		id: "insert-file-search",
		name: "Insert file search",
		editorCallback: (editor: Editor, view: MarkdownView) => {
			const leftText = "[[";
			const rightText = "]]";

			insertText(editor, leftText, rightText);
		},
	};
}
