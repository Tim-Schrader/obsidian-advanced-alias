import { setIcon } from "obsidian";
import { LinkSuggestionValueInterface } from "src/suggestion/LinkSuggestion";
import getSuggestionItemNote from "./getSuggestionItemNote";
import getSuggestionItemTitle from "./getSuggestionItemTitle";
import getSuggestionItemAux from "./getSuggestionItemAux";

/**
 * Creates a styled suggestion item in the suggestion popover.
 *
 * @param el - The HTML element of a singular suggestion item
 * @param value - The value to display in the suggestion item
 */
export default function createComplexSuggestionItem(
	el: HTMLElement,
	suggestionValue: LinkSuggestionValueInterface
) {
	const title = getSuggestionItemTitle(suggestionValue);
	const note = getSuggestionItemNote(suggestionValue);
	const aux = getSuggestionItemAux(suggestionValue);

	el.addClass("mod-complex");

	const contentElement = el.createEl("div", { cls: "suggestion-content" });
	contentElement.createEl("div", { text: title, cls: "suggestion-title" });
	contentElement.createEl("div", { text: note, cls: "suggestion-note" });

	const auxElement = el.createEl("div", { cls: "suggestion-aux" });

	const flair = auxElement.createEl("span", {
		cls: "suggestion-flair",
		attr: { "aria-label": "Alias" },
	});
	if (aux.heading !== null) {
		flair.textContent = `H${aux.heading}`;
	}
	if (aux.alias) {
		setIcon(flair, "forward");
	}
}
