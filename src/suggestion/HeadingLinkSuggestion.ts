import {
	EditorSuggest,
	EditorPosition,
	Editor,
	EditorSuggestTriggerInfo,
	EditorSuggestContext,
	Instruction,
	setIcon,
	App,
} from "obsidian";
import { getSearchRegex, regexFromString } from "../utils/regex";
import { getSuggestionsFromHeadingAliases } from "./utils/getSuggestionFromHeadingAliases";
import AdvancedAliasPlugin from "main";
import findMatchInLine from "./utils/findMatchInLine";

export interface HeadingLinkInterface {
	alias: string;
	heading: string;
}

export interface HeadingSuggestionValueInterface {
	alias: string;
	heading: string;
	file: string;
}

/**
 * Suggestion class for handling suggestions for heading links
 */
export default class HeadingLinkSuggestion extends EditorSuggest<any> {
	private plugin: AdvancedAliasPlugin;

	constructor(app: App, plugin: AdvancedAliasPlugin) {
		super(app);
		this.plugin = plugin;
	}

	/* <--- Identifier ---> */
	public get leftIdentifier(): string {
		return this.plugin.settings.headingAlias.leftIdentifier;
	}
	public get rightIdentifier(): string {
		return this.plugin.settings.headingAlias.rightIdentifier;
	}

	public get leftRegex(): RegExp {
		return regexFromString(this.leftIdentifier);
	}
	public get rightRegex(): RegExp {
		return regexFromString(this.rightIdentifier);
	}

	/**
	 * Regular expression to match the full pattern of a heading link search
	 *
	 * @public
	 */
	public get headingLinkSearchRegex(): RegExp {
		return getSearchRegex(this.leftIdentifier, this.rightIdentifier);
	}

	/**
	 * The property used in the frontmatter to safe all the heading aliases
	 */
	private static readonly frontmatterKeys = [
		"heading-aliases",
		"heading-alias",
	];

	/**
	 * Instructions displayed in the suggestion popover
	 */
	private static readonly instructions: Instruction[] = [
		{ command: "↵", purpose: "to accept" },
	];

	/* <--- Methods ---> */

	/**
	 * Checks if the cursor is inside a heading link search.
	 *
	 * @param cursor - The current cursor position
	 * @param editor - The current editor
	 * @returns The start, end and content of the heading link search
	 * @see Implementation of abstract function {@link https://docs.obsidian.md/Reference/TypeScript+API/EditorSuggest/onTrigger onTrigger} in EditorSuggest
	 */
	onTrigger(
		cursor: EditorPosition,
		editor: Editor
	): EditorSuggestTriggerInfo | null {
		const lineText = editor.getLine(cursor.line);
		const cursorPos = cursor.ch;

		const match = findMatchInLine(lineText, cursorPos, {
			leftIdentifier: this.leftIdentifier,
			rightIdentifier: this.rightIdentifier,
			searchRegex: this.headingLinkSearchRegex,
		});

		if (match) {
			const { start, end, validContent } = match;

			return {
				start: { line: cursor.line, ch: start },
				end: { line: cursor.line, ch: end },
				query: validContent,
			};
		}

		return null;
	}

	/**
	 * Searches the vault for files with heading aliases conatining the query.
	 *
	 * @param context - The context of the suggestion
	 * @returns An array of suggestions matching the query
	 * @see Implementation of abstract function {@link https://docs.obsidian.md/Reference/TypeScript+API/EditorSuggest/getSuggestions getSuggestions} in EditorSuggest
	 */
	getSuggestions(
		context: EditorSuggestContext
	): HeadingSuggestionValueInterface[] {
		const suggestions: HeadingSuggestionValueInterface[] = [];
		const query = context.query.toLowerCase();

		const files = this.app.vault.getMarkdownFiles();

		files.forEach((file) => {
			const metadata = this.app.metadataCache.getFileCache(file);
			const fileName = file.basename;

			for (const key of HeadingLinkSuggestion.frontmatterKeys) {
				if (metadata?.frontmatter?.[key]) {
					const headingAliases = metadata.frontmatter[key];                    

					suggestions.push(
						...getSuggestionsFromHeadingAliases(
							headingAliases,
							query,
							fileName
						)
					);
				}
			}
		});
		return suggestions;
	}

	/**
	 * Render of a single suggestion item (done for every suggestion).
	 *
	 * @param value - The suggestion value
	 * @param el - The HTML element of the item associated with the suggestion
	 * @see Implementation of abstract function {@link https://docs.obsidian.md/Reference/TypeScript+API/PopoverSuggest/renderSuggestion renderSuggestion} in EditorSuggest
	 */
	renderSuggestion(
		value: HeadingSuggestionValueInterface,
		el: HTMLElement
	): void {
		createComplexSuggestionItem(el, value);
		this.setInstructions(HeadingLinkSuggestion.instructions);
	}

	/**
	 * Handles the selection of a suggestion and replaces the matched text in the editor.
	 *
	 * @param value - The selected suggestion object
	 * @param evt - The event triggering the selection (mouse or keyboard)
	 * @see Implementation of abstract function {@link https://docs.obsidian.md/Reference/TypeScript+API/PopoverSuggest/selectSuggestion selectSuggestion} in EditorSuggest
	 */
	selectSuggestion(
		value: HeadingSuggestionValueInterface,
		evt: MouseEvent | KeyboardEvent
	): void {
		const editor = this.context?.editor;

		if (!editor) {
			console.warn("No active editor found.");
			return;
		}

		if (!this.context) {
			console.warn("No valid context found.");
			return;
		}

		// Retrieve start and end positions provided by onTrigger
		const { start, end } = this.context;
		if (!start || !end) {
			console.warn("No valid context position found.");
			return;
		}

		// Extend range to include the full regex match
		start.ch -= this.leftIdentifier.length;
		end.ch += this.rightIdentifier.length;
		const replacement = `[[${value.file + value.heading}|${value.alias}]]`;
		editor.replaceRange(replacement, start, end);

		// Optionally place the cursor after the replacement
		const newCursorPos = {
			line: start.line,
			ch: start.ch + replacement.length,
		};
		editor.setCursor(newCursorPos);
	}
}

/**
 * Creates a styled suggestion item in the suggestion modal.
 *
 * @param el - The HTML element of a singular suggestion item
 * @param value - The value to display in the suggestion item
 */
export const createComplexSuggestionItem = (el: HTMLElement, value: any) => {
	const { alias, heading, file } = value;
	const formattedHeading = heading.replace(/#/g, " #");
	const note = file + formattedHeading;

	el.addClass("mod-complex");

	const content = el.createEl("div", { cls: "suggestion-content" });
	content.createEl("div", { text: alias, cls: "suggestion-title" });
	content.createEl("div", { text: note, cls: "suggestion-note" });

	const aux = el.createEl("div", { cls: "suggestion-aux" });
	const flair = aux.createEl("span", {
		cls: "suggestion-flair",
		attr: { "aria-label": "Alias" },
	});
	setIcon(flair, "forward");
};
