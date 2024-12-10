import AdvancedAliasPlugin from "main";
import { Command, Editor, MarkdownView } from "obsidian";
import insertText from "./utils/insertText";

/**
 * @returns The command to insert a search for all links
 */
export default function insertAllLinkSearchCommand(
	plugin: AdvancedAliasPlugin
): Command {
	return {
		id: "insert-all-link-search",
		name: "Insert all link search",
		editorCallback: (editor: Editor, view: MarkdownView) => {
			const leftText = plugin.settings.allLink.leftIdentifier;
			const rightText = plugin.settings.allLink.rightIdentifier;

			insertText(editor, leftText, rightText);
		},
	};
}
