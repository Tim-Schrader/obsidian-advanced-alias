import AdvancedAliasPlugin from "main";
import { PluginSettingTab, App, Setting } from "obsidian";

export interface AdvancedAliasSettings {
	search: {
		leftIdentifier: string;
		rightIdentifier: string;
		ignoreCase: boolean;
	};
}

export const DEFAULT_SETTINGS: AdvancedAliasSettings = {
	search: {
		leftIdentifier: "((",
		rightIdentifier: "))",
		ignoreCase: true,
	},
};

export default class AdvancedAliasSettingTab extends PluginSettingTab {
	plugin: AdvancedAliasPlugin;

	constructor(app: App, plugin: AdvancedAliasPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setName("Search").setHeading();

		new Setting(containerEl)
			.setName("Left Identifier")
			.setDesc("The left side that identifies the search.")
			.addText((text) =>
				text
					.setPlaceholder("((#")
					.setValue(this.plugin.settings.search.leftIdentifier)
					.onChange(async (value) => {
						if (value === "" || value === null) {
							value = DEFAULT_SETTINGS.search.leftIdentifier;
						}
						this.plugin.settings.search.leftIdentifier = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Right Identifier")
			.setDesc("The right side that identifies the search.")
			.addText((text) =>
				text
					.setPlaceholder("))")
					.setValue(this.plugin.settings.search.rightIdentifier)
					.onChange(async (value) => {
						if (value === "" || value === null) {
							value = DEFAULT_SETTINGS.search.rightIdentifier;
						}
						this.plugin.settings.search.rightIdentifier = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Ignore Case")
			.setDesc("Ignore the case of the search.")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.search.ignoreCase)
					.onChange(async (value) => {
						this.plugin.settings.search.ignoreCase = value;
						await this.plugin.saveSettings();
					});
			});
	}
}
