import { getSuggestionsFromHeadingAliases } from "src/suggestion/utils/getSuggestionFromHeadingAlias";

test("list of heading aliases without query", () => {
	const headingAliases = [
		{ alias: "heading one", heading: "heading1" },
		{ alias: "one", heading: "heading1" },
		{ alias: "heading two", heading: "heading2" },
		{ alias: "two", heading: "heading2" },
	];
	const query = "";
	const file = "file";

	const suggestions = [
		{ alias: "heading one", heading: "heading1", file: "file" },
		{ alias: "one", heading: "heading1", file: "file" },
		{ alias: "heading two", heading: "heading2", file: "file" },
		{ alias: "two", heading: "heading2", file: "file" },
	];
	expect(
		getSuggestionsFromHeadingAliases(headingAliases, query, file)
	).toEqual(suggestions);
});

test("list of heading aliases with query", () => {
	const headingAliases = [
		{ alias: "heading one", heading: "heading1" },
		{ alias: "one", heading: "heading1" },
		{ alias: "heading two", heading: "heading2" },
		{ alias: "two", heading: "heading2" },
	];
	const query = "heading";
	const file = "file";

	const suggestions = [
		{ alias: "heading one", heading: "heading1", file: "file" },
		{ alias: "heading two", heading: "heading2", file: "file" },
	];
	expect(
		getSuggestionsFromHeadingAliases(headingAliases, query, file)
	).toEqual(suggestions);
});

