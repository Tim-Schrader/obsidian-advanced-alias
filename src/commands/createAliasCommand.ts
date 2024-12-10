import { Command, Editor, MarkdownView, Notice } from "obsidian";
import getCurrentLink from "./utils/getCurrentLink";
import getPartsFromLink from "./utils/getPartsFromLink";
import findFile from "./utils/findFile";
import addHeadingAlias from "./utils/addHeadingAlias";
import addAlias from "./utils/addAlias";

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
                new Notice("Invalid link format.");
                return;
            }
    
            const { fileName, heading, alias } = linkParts;
            if (!alias) {
                new Notice("No alias found.");
                return;
            }
            
            const file = findFile(view.app, fileName)
            if (!file) {
                new Notice("No file found.")
                return
            }
    
            if (heading) {
                addHeadingAlias(view.app.fileManager, file, heading, alias)
            } else {
                addAlias(view.app.fileManager, file, alias)
            }
        },
    };
}