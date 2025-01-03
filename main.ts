import { Plugin } from "obsidian";
import createAliasCommand from "src/commands/createAliasCommand";
import insertAllLinkSearchCommand from "src/commands/insertAdvancedLinkSearchCommand";
import AdvancedAliasSettingTab from "src/settings/SettingTab";
import { AdvancedAliasSettings, DEFAULT_SETTINGS } from "src/settings/SettingTab";
import LinkSuggestion from "src/suggestion/LinkSuggestion";

export default class AdvancedAliasPlugin extends Plugin {
	settings: AdvancedAliasSettings;

	async onload() {
		await this.loadSettings();

		/* <--- Suggestions ---> */
/* 		this.registerEditorSuggest(new HeadingLinkSuggestion(this.app, this));
 */		this.registerEditorSuggest(new LinkSuggestion(this.app, this));

		/* <--- Commands ---> */
		this.addCommand(createAliasCommand());
		this.addCommand(insertAllLinkSearchCommand(this));

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
