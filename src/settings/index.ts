import { ButtonComponent, PluginSettingTab, Setting } from 'obsidian'
import PluginsListModal from '../components/plugins-list-modal'
import SourcesListModal from '../components/sources-list-modal'
import SourcesPlugin from '../index'
import Source from '../model/source'
import fetchSource from '../utils/fetch-source'

export interface SourcesPluginSettings {
	sourcesList: Source[]
}

export const DEFAULT_SETTINGS: SourcesPluginSettings = {
	sourcesList: [],
}

export class SourcesSettingTab extends PluginSettingTab {
	constructor(private plugin: SourcesPlugin) {
		super(plugin.app, plugin)
	}

	display() {
		const { containerEl } = this
		containerEl.empty()

		new Setting(containerEl)
			.setName('源管理')
			.setDesc('管理您的插件源列表')
			.addButton((button: ButtonComponent) => {
				button.setButtonText('管理源列表').onClick(() => {
					new SourcesListModal(this.plugin, () => {
						this.display()
					}).open()
				})
			})

		new Setting(containerEl)
			.setName('更新源元数据')
			.setDesc('从所有源获取最新的元数据信息')
			.addButton((button: ButtonComponent) => {
				button.setButtonText('更新').onClick(async () => {
					await this.updateAllSourcesMetadata()
					this.display()
				})
			})

		new Setting(containerEl)
			.setName('显示所有插件')
			.setDesc('查看所有源中的插件及提供安装功能')
			.addButton((button: ButtonComponent) => {
				button.setButtonText('显示插件').onClick(() => {
					new PluginsListModal(this.plugin).open()
				})
			})

		const sourcesCount = this.plugin.settings.sourcesList.length
		containerEl.createEl('div', {
			text: `当前已添加 ${sourcesCount} 个源`,
		})
	}

	async updateAllSourcesMetadata() {
		const { sourcesList } = this.plugin.settings

		for (let i = 0; i < sourcesList.length; i++) {
			try {
				const source = sourcesList[i]
				const metadata = await fetchSource(source)
				source.metadata = metadata
				source.lastUpdated = Date.now()
			} catch (error) {
				console.error(`Failed to update source: ${sourcesList[i].url}`, error)
			}
		}

		await this.plugin.saveSettings()
	}
}
