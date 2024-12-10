import {
	EditorSuggest,
	EditorPosition,
	Editor,
	EditorSuggestTriggerInfo,
	EditorSuggestContext,
	Instruction,
	setIcon,
	App,
    Notice,
} from "obsidian";
import { getSearchRegex, regexFromString } from "../utils/regex";
import { getSuggestionsFromHeadingAliases } from "./utils/getSuggestionFromHeadingAliases";
import AdvancedAliasPlugin from "main";
import { getSuggestionsFromAliases } from "./utils/getSuggestionFromAliases";
import findMatchInLine from "./utils/findMatchInLine";

export interface HeadingAliasesInterface {
	alias: string;
	heading: string;
}

export interface AllSuggestionValueInterface {
	alias: string | null;
	heading: string | null;
	file: string;
}

/**
 * Suggestion class for handling suggestions for links.
 */
export default class AllLinkSuggestion extends EditorSuggest<any> {
	private plugin: AdvancedAliasPlugin;

	constructor(app: App, plugin: AdvancedAliasPlugin) {
		super(app);
		this.plugin = plugin;
	}

	/* <--- Static Properties ---> */
	public get leftIdentifier(): string {
		return this.plugin.settings.allLink.leftIdentifier;
	}
	public get rightIdentifier(): string {
		return this.plugin.settings.allLink.rightIdentifier;
	}

	public get leftRegex(): RegExp {
		return regexFromString(this.leftIdentifier);
	}
	public get rightRegex(): RegExp {
		return regexFromString(this.rightIdentifier);
	}

	public static readonly validContentRegex =
		/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|[a-zA-Z0-9\s\-_\/\.:äöüÄÖÜßéáíóúçñÊÈëïôû])+/g;

	/**
	 * Regular expression to match the full pattern of a link search.
	 *
	 * @public
	 */
	public get allAliasSearchRegex(): RegExp {
		return new RegExp(
			`${this.leftRegex.source}(${AllLinkSuggestion.validContentRegex.source})?${this.rightRegex.source}`,
			"g"
		);
	}

	/**
	 * The property used in the frontmatter to safe all the aliases.
	 */
	private static readonly frontmatterKeys = {
		alias: ["alias", "aliases"],
		headingAlias: ["heading-aliases", "heading-alias"],
	};

	/**
	 * Instructions displayed in the suggestion popover.
	 *
	 * @private
	 * @static
	 * @readonly
	 */
	private static readonly instructions: Instruction[] = [
		{ command: "↵", purpose: "to accept" },
	];

	/* <--- Methods ---> */

	/**
	 * Checks if the cursor is inside a link search.
	 *
	 * @param cursor - The current cursor position
	 * @param editor - The current editor
	 * @returns The start, end and content of the link search
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
			searchRegex: this.allAliasSearchRegex,
		});

		const leftHeadingIdentifier =
			this.plugin.settings.headingAlias.leftIdentifier;
		const rightHeadingIdentifier =
			this.plugin.settings.headingAlias.rightIdentifier;
		const headingSearchRegex = getSearchRegex(
			leftHeadingIdentifier,
			rightHeadingIdentifier
		);

		// dont render if already searching for heading alias
		const headingMatch = findMatchInLine(lineText, cursorPos, {
			leftIdentifier: leftHeadingIdentifier,
			rightIdentifier: rightHeadingIdentifier,
			searchRegex: headingSearchRegex,
		});

		if (headingMatch) {
			return null;
		}

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
	 * Searches the vault for files and aliases conatining the query.
	 *
	 * @param context - The context of the suggestion
	 * @returns An array of suggestions matching the query
	 * @see Implementation of abstract function {@link https://docs.obsidian.md/Reference/TypeScript+API/EditorSuggest/getSuggestions getSuggestions} in EditorSuggest
	 */
	getSuggestions(
		context: EditorSuggestContext
	): AllSuggestionValueInterface[] {
		const suggestions: AllSuggestionValueInterface[] = [];
		const query = context.query.toLowerCase();

		const files = this.app.vault.getMarkdownFiles();

		files.forEach((file) => {
			const metadata = this.app.metadataCache.getFileCache(file);
			const fileName = file.basename;

			// search for file names
			if (fileName.toLowerCase().includes(query)) {
				suggestions.push({
					alias: null,
					heading: null,
					file: fileName,
				});
			}

			// search for aliases
			for (const key of AllLinkSuggestion.frontmatterKeys.alias) {
				if (metadata?.frontmatter?.[key]) {
					const aliases = metadata.frontmatter[key];

                    console.log(aliases);

					suggestions.push(
						...getSuggestionsFromAliases(aliases, query, fileName)
					);
				}
			}

			// search for heading aliases
			for (const key of AllLinkSuggestion.frontmatterKeys.headingAlias) {
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
		value: AllSuggestionValueInterface,
		el: HTMLElement
	): void {
		createComplexSuggestionItem(el, value);
		this.setInstructions(AllLinkSuggestion.instructions);
	}

	/**
	 * Handles the selection of a suggestion and replaces the matched text in the editor.
	 *
	 * @param value - The selected suggestion object
	 * @param evt - The event triggering the selection (mouse or keyboard)
	 * @see Implementation of abstract function {@link https://docs.obsidian.md/Reference/TypeScript+API/PopoverSuggest/selectSuggestion selectSuggestion} in EditorSuggest
	 */
	selectSuggestion(
		value: AllSuggestionValueInterface,
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

        if (!value.file) {
            new Notice("Invalid file.");
        }

		let replacement: string;
		if (!value.alias) {
			replacement = `[[${value.file}${value.heading ? value.heading : ""}]]`;
		} else {
            replacement = `[[${value.file}${value.heading ? value.heading : ""}|${value.alias}]]`;
        }
        
		// Extend range to include the full regex match
		start.ch -= this.leftIdentifier.length;
		end.ch += this.rightIdentifier.length;

		editor.replaceRange(replacement, start, end);

		// Place the cursor after the replacement
		const newCursorPos = {
			line: start.line,
			ch: start.ch + replacement.length,
		};
		editor.setCursor(newCursorPos);
	}
}

/**
 * Creates a styled suggestion item in the suggestion popover.
 *
 * @param el - The HTML element of a singular suggestion item
 * @param value - The value to display in the suggestion item
 */
export const createComplexSuggestionItem = (
	el: HTMLElement,
	value: AllSuggestionValueInterface
) => {
	const { alias, heading, file } = value;
	let note: string;

	if (!alias) {
		el.setText(file);
		return;
	} else if (!heading) {
		note = file;
	} else {
		const formattedHeading = heading.replace(/#/g, " #");
		note = file + formattedHeading;
	}

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
