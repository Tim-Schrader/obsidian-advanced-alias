import AdvancedAliasPlugin from "main";
import { PluginSettingTab, App, Setting } from "obsidian";

export interface AdvancedAliasSettings {
	headingAlias: {
		leftIdentifier: string;
		rightIdentifier: string;
	};
	allLink: {
		leftIdentifier: string;
		rightIdentifier: string;
	};
}

export const DEFAULT_SETTINGS: AdvancedAliasSettings = {
	headingAlias: {
		leftIdentifier: "((#",
		rightIdentifier: "))",
	},
	allLink: {
		leftIdentifier: "((",
		rightIdentifier: "))",
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

		const headingAliasSetting = new Setting(containerEl)
			.setName("Heading Alias")
			.setHeading();

		new Setting(containerEl)
			.setName("Left Identifier")
			.setDesc("The left side that identifies the heading alias search.")
			.addText((text) =>
				text
					.setPlaceholder("((#")
					.setValue(this.plugin.settings.headingAlias.leftIdentifier)
					.onChange(async (value) => {
                        if (value === "" || value === null) {
                            value = DEFAULT_SETTINGS.headingAlias.leftIdentifier;
                        }
						this.plugin.settings.headingAlias.leftIdentifier =
							value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Right Identifier")
			.setDesc("The right side that identifies the heading alias search.")
			.addText((text) =>
				text
					.setPlaceholder("))")
					.setValue(this.plugin.settings.headingAlias.rightIdentifier)
					.onChange(async (value) => {
                        if (value === "" || value === null) {
                            value = DEFAULT_SETTINGS.headingAlias.rightIdentifier;
                        }
						this.plugin.settings.headingAlias.rightIdentifier =
							value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl).setName("All Alias").setHeading();

		new Setting(containerEl)
			.setName("Left Identifier")
			.setDesc("The left side that identifies the alias search.")
			.addText((text) =>
				text
					.setPlaceholder("((")
					.setValue(this.plugin.settings.allLink.leftIdentifier)
					.onChange(async (value) => {
                        if (value === "" || value === null) {
                            value = DEFAULT_SETTINGS.allLink.leftIdentifier;
                        }
						this.plugin.settings.allLink.leftIdentifier =
							value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Right Identifier")
			.setDesc("The right side that identifies the alias search.")
			.addText((text) =>
				text
					.setPlaceholder("))")
					.setValue(this.plugin.settings.allLink.rightIdentifier)
					.onChange(async (value) => {
                        if (value === "" || value === null) {
                            value = DEFAULT_SETTINGS.allLink.rightIdentifier;
                        }
						this.plugin.settings.allLink.rightIdentifier =
							value;
						await this.plugin.saveSettings();
					})
			);
	}
}
