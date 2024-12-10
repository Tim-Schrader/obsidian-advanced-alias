import { Editor } from "obsidian";

/**
 * Inserts text at current cursor position.
 * 
 * @param editor
 * @param text - The text to be inserted (is inserted left to the cursor)
 * @param rightText - Optional text to be inserted after the cursor
 */
export default function insertText(
	editor: Editor,
	text: string,
	rightText?: string
) {
	const cursor = editor.getCursor();

	const fullText = `${text}${rightText || ""}`;

	editor.replaceRange(fullText, cursor);

	const newCursor = { line: cursor.line, ch: cursor.ch + text.length };
	editor.setCursor(newCursor);
}
