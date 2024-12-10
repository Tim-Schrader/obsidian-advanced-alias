import AdvancedAliasPlugin from "main";
import { Command, Editor, MarkdownView } from "obsidian";
import insertText from "./utils/insertText";

/**
 * @returns The command to insert a search for heading aliases
 */
export default function insertHeadingAliasSearchCommand(
	plugin: AdvancedAliasPlugin
): Command {
	return {
		id: "insert-heading-alias-search",
		name: "Insert heading alias search",
		editorCallback: (editor: Editor, view: MarkdownView) => {
			const leftText = plugin.settings.headingAlias.leftIdentifier;
			const rightText = plugin.settings.headingAlias.rightIdentifier;

			insertText(editor, leftText, rightText);
		},
	};
}
