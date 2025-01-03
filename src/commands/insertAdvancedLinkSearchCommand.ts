import AdvancedAliasPlugin from "main";
import { Command, Editor, MarkdownView } from "obsidian";
import insertText from "../utils/text/insertText";

/**
 * @returns The command to insert a search for all links
 */
export default function insertAllLinkSearchCommand(
	plugin: AdvancedAliasPlugin
): Command {
	return {
		id: "insert-advanced-link-search",
		name: "Insert advanced link search",
		editorCallback: (editor: Editor, view: MarkdownView) => {
			const leftText = plugin.settings.search.leftIdentifier;
			const rightText = plugin.settings.search.rightIdentifier;

			insertText(editor, leftText, rightText);
		},
	};
}
