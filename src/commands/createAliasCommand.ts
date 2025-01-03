import { Command, Editor, MarkdownView, Notice } from "obsidian";
import getCurrentLink from "../utils/text/getCurrentLink";
import getPartsFromLink from "../utils/text/getPartsFromLink";
import findFile from "../utils/file/findFile";
import addHeadingAlias from "../utils/file/addHeadingAlias";
import addAlias from "src/utils/file/addAlias";

/**
 * @returns The command to create an alias for a link
 */
export default function createAliasCommand(): Command {
	return {
		id: "create-alias",
		name: "Create Alias",
		editorCallback: (editor: Editor, view: MarkdownView) => {
			const cursor = editor.getCursor();
			const cursorPos = cursor.ch;
			const lineText = editor.getLine(cursor.line);

			const linkText = getCurrentLink(lineText, cursorPos);
			if (!linkText) {
				new Notice("Cursor is not inside a link.");
				return;
			}

			const linkParts = getPartsFromLink(linkText);
			if (!linkParts) {
				return;
			}

			const { fileName, heading, alias } = linkParts;
			if (!alias) {
				new Notice("No alias found.");
				return;
			}

			const file = findFile(view.app, fileName);
			if (file === null) {
				return;
			}

			if (heading) {
				addHeadingAlias(view.app.fileManager, file, heading, alias);
			} else {
				addAlias(view.app.fileManager, file, alias);
			}
		},
	};
}
