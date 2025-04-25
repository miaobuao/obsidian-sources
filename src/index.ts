import { Plugin } from 'obsidian'
import {
	DEFAULT_SETTINGS,
	MyPluginSettings,
	SourcesSettingTab,
} from './settings'

export default class SourcesPlugin extends Plugin {
	settings: MyPluginSettings

	async onload() {
		this.addSettingTab(new SourcesSettingTab(this))
		await this.loadSettings()
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		)
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}
