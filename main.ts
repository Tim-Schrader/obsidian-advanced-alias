import { Plugin } from "obsidian";
import createAliasCommand from "src/commands/createAliasCommand";
import insertAllLinkSearchCommand from "src/commands/insertAllLinkSearchCommand";
import insertFileSearchCommand from "src/commands/insertFileSearchCommand";
import insertHeadingAliasSearchCommand from "src/commands/insertHeadingAliasSearchCommand";
import insertHeadingSearchCommand from "src/commands/insertHeadingSearchCommand";
import AdvancedAliasSettingTab from "src/SettingTab";
import { AdvancedAliasSettings, DEFAULT_SETTINGS } from "src/SettingTab";
import AllLinkSuggestion from "src/suggestion/AllLinkSuggestion";
import HeadingLinkSuggestion from "src/suggestion/HeadingLinkSuggestion";

export default class AdvancedAliasPlugin extends Plugin {
	settings: AdvancedAliasSettings;

	async onload() {
		await this.loadSettings();

		/* <--- Suggestions ---> */
		this.registerEditorSuggest(new HeadingLinkSuggestion(this.app, this));
		this.registerEditorSuggest(new AllLinkSuggestion(this.app, this));

		/* <--- Commands ---> */
		this.addCommand(createAliasCommand());
		this.addCommand(insertAllLinkSearchCommand(this));
		this.addCommand(insertHeadingAliasSearchCommand(this));
		this.addCommand(insertHeadingSearchCommand());
		this.addCommand(insertFileSearchCommand());

		/* <--- Setting Tab ---> */
		this.addSettingTab(new AdvancedAliasSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
