import {
	EditorSuggest,
	EditorPosition,
	Editor,
	EditorSuggestTriggerInfo,
	EditorSuggestContext,
	Instruction,
	App,
	Notice,
} from "obsidian";
import AdvancedAliasPlugin from "main";
import findMatchInLine from "../utils/text/findMatchInLine";
import getMatchingFiles from "../utils/search/getMatchingFiles";
import getMatchingFileAliases from "src/utils/search/getMatchingFileAliases";
import getMatchingHeadings from "src/utils/search/getMatchingHeadings";
import getMatchingHeadingAliases from "src/utils/search/getMatchingHeadingAliases";
import getQuery from "../utils/search/getQuery";
import regexFromString from "src/utils/regex/regexFromString";
import createComplexSuggestionItem from "src/utils/suggestion/createComplexSuggestionItem";

export interface HeadingAliasesInterface {
	alias: string;
	heading: string;
	level: number;
}

export interface LinkSuggestionValueInterface {
	alias: string | null;
	heading: {
		text: string;
		level: number;
	} | null;
	file: {
		name: string;
		path: string;
	};
}

/**
 * Suggestion class for handling suggestions for links.
 */
export default class LinkSuggestion extends EditorSuggest<any> {
	private plugin: AdvancedAliasPlugin;

	constructor(app: App, plugin: AdvancedAliasPlugin) {
		super(app);
		this.plugin = plugin;
	}

	/* <--- Static Properties ---> */
	public get leftIdentifier(): string {
		return this.plugin.settings.search.leftIdentifier;
	}
	public get rightIdentifier(): string {
		return this.plugin.settings.search.rightIdentifier;
	}

	public get leftRegex(): RegExp {
		return regexFromString(this.leftIdentifier);
	}
	public get rightRegex(): RegExp {
		return regexFromString(this.rightIdentifier);
	}

	public static readonly validContentRegex =
		/([\p{L}\p{N}\p{S}\p{P}\p{M}\s])+/gu;

	/**
	 * Regular expression to match the full pattern of a link search.
	 *
	 * @public
	 */
	public get allAliasSearchRegex(): RegExp {
		return new RegExp(
			`${this.leftRegex.source}(${LinkSuggestion.validContentRegex.source})?${this.rightRegex.source}`,
			LinkSuggestion.validContentRegex.flags
		);
	}

	/**
	 * The property used in the frontmatter to safe all the aliases.
	 */
	private static readonly frontmatterKeys = {
		fileAlias: ["alias", "aliases"],
		headingAlias: ["heading-aliases", "heading-alias"],
	};

	/**
	 * Instructions displayed in the suggestion popover.
	 *
	 * @private
	 * @static
	 * @readonly
	 */
	private static readonly instructions: {
		file: Instruction;
		heading: Instruction;
		alias: Instruction;
		accept: Instruction;
	} = {
		file: { command: "Type *", purpose: "to search files" },
		heading: { command: "Type #", purpose: "to search headings" },
		alias: { command: "Type @", purpose: "to search aliases" },
		accept: { command: "↵", purpose: "to accept" },
	};

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

		const search = {
			leftIdentifier: this.leftIdentifier,
			rightIdentifier: this.rightIdentifier,
			searchRegex: this.allAliasSearchRegex,
		};

		const match = findMatchInLine(lineText, cursorPos, search);

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
	): LinkSuggestionValueInterface[] {
		const suggestions: LinkSuggestionValueInterface[] = [];

		const ignoreCase = this.plugin.settings.search.ignoreCase;
		const query = context.query;

		const files = this.app.vault.getMarkdownFiles();

		const { queryText, queryType, searchOptions } = getQuery(query);

		// search for file names
		if (queryType.file) {
			const matchingFiles = getMatchingFiles(
				files,
				queryText,
				ignoreCase
			);
			suggestions.push(...matchingFiles);
		}

		// search for file aliases
		if (queryType.fileAlias) {
			const aliasSuggestions = getMatchingFileAliases(
				files,
				queryText,
				ignoreCase,
				LinkSuggestion.frontmatterKeys.fileAlias,
				this.app
			);
			suggestions.push(...aliasSuggestions);
		}

		// search for headings
		if (queryType.heading) {
			const headingSuggestions = getMatchingHeadings(
				files,
				queryText,
				ignoreCase,
				this.app
			);
			suggestions.push(...headingSuggestions);
		}

		// search for heading aliases
		if (queryType.headingAlias) {
			const headingAliasSuggestions = getMatchingHeadingAliases(
				files,
				queryText,
				ignoreCase,
				LinkSuggestion.frontmatterKeys.headingAlias,
				this.app
			);
			suggestions.push(...headingAliasSuggestions);
		}

		// set instructions
		const instructions: Instruction[] = [];

		if (!searchOptions.file && !searchOptions.heading) {
			instructions.push(LinkSuggestion.instructions.file);
			instructions.push(LinkSuggestion.instructions.heading);
		}
		if (!searchOptions.alias) {
			instructions.push(LinkSuggestion.instructions.alias);
		}
		instructions.push(LinkSuggestion.instructions.accept);

		this.setInstructions(instructions);

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
		value: LinkSuggestionValueInterface,
		el: HTMLElement
	): void {
		createComplexSuggestionItem(el, value);
	}

	/**
	 * Handles the selection of a suggestion and replaces the matched text in the editor.
	 *
	 * @param value - The selected suggestion object
	 * @param evt - The event triggering the selection (mouse or keyboard)
	 * @see Implementation of abstract function {@link https://docs.obsidian.md/Reference/TypeScript+API/PopoverSuggest/selectSuggestion selectSuggestion} in EditorSuggest
	 */
	selectSuggestion(
		value: LinkSuggestionValueInterface,
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
			replacement = `[[${value.file.path + value.file.name}${
				value.heading
					? "#".repeat(value.heading.level) + value.heading.text
					: ""
			}]]`;
		} else {
			replacement = `[[${value.file.path + value.file.name}${
				value.heading
					? "#".repeat(value.heading.level) + value.heading.text
					: ""
			}|${value.alias}]]`;
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
