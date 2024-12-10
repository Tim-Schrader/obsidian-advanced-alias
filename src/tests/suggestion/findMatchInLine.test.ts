import { findMatchInLine } from "src/suggestion/utils/findMatchInLine";

const leftIdentifier = "((#";
const rightIdentifier = "))";
const searchRegex =
	/\(\(#((\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|[a-zA-Z0-9\s\-_\/\.:äöüÄÖÜßéáíóúçñÊÈëïôû])+)?\)\)/g;

const search = {
	leftIdentifier,
	rightIdentifier,
	searchRegex,
};

const defaultLineText = "beginning text ((#test)) end text";
const defaultExpected = { start: 18, end: 22, validContent: "test" };

const testcases = [
	{
		name: "inside match",
		lineText: defaultLineText,
		cursorPos: 21,
		expected: defaultExpected,
	},
	{
		name: "left to match",
		lineText: defaultLineText,
		cursorPos: 9,
		expected: null,
	},
	{
		name: "right to match",
		lineText: defaultLineText,
		cursorPos: 25,
		expected: null,
	},
	{
		name: "no match",
		lineText: "beginning text end text",
		cursorPos: 5,
		expected: null,
	},
	{
		name: "exactly left inside match",
		lineText: defaultLineText,
		cursorPos: 16,
		expected: defaultExpected,
	},
	{
		name: "exactly left outside match",
		lineText: defaultLineText,
		cursorPos: 15,
		expected: null,
	},
	{
		name: "exactly right inside match",
		lineText: defaultLineText,
		cursorPos: 23,
		expected: defaultExpected,
	},
	{
		name: "exactly left outside match",
		lineText: defaultLineText,
		cursorPos: 24,
		expected: null,
	},
    {
        name: "empty match",
        lineText: "beginning text ((#)) end text",
        cursorPos: 18,
        expected: { start: 18, end: 18, validContent: "" },
    }
];

for (const { name, lineText, cursorPos, expected } of testcases) {
    test(name, () => {
        expect(findMatchInLine(lineText, cursorPos, search)).toEqual(expected);
    });
}