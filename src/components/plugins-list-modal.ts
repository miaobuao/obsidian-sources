import { loadAsync as loadZipAsync } from 'jszip'
import { ButtonComponent, Modal, normalizePath, requestUrl } from 'obsidian'
import { join } from 'path'
import SourceMetadata from '~/model/source-metadata'
import SourcesPlugin from '../index'

export default class PluginsListModal extends Modal {
	constructor(private plugin: SourcesPlugin) {
		super(plugin.app)
	}

	onOpen() {
		const { contentEl } = this
		contentEl.empty()
		contentEl.createEl('h2', { text: '可用插件列表' })

		const pluginsContainer = contentEl.createDiv({})

		this.renderPluginsList(pluginsContainer)

		const buttonContainer = contentEl.createDiv({})

		new ButtonComponent(buttonContainer).setButtonText('关闭').onClick(() => {
			this.close()
		})
	}

	private renderPluginsList(container: HTMLElement) {
		container.empty()

		const { sourcesList } = this.plugin.settings
		let hasAnyPlugins = false

		for (const source of sourcesList) {
			// Skip sources without metadata
			if (!source.metadata || source.metadata.length === 0) {
				continue
			}

			hasAnyPlugins = true

			const sourceSection = container.createDiv({})

			sourceSection.createEl('h3', { text: `源: ${source.url}` })

			const table = sourceSection.createEl('table', {})
			const thead = table.createEl('thead')
			const headerRow = thead.createEl('tr')
			headerRow.createEl('th', { text: '名称' })
			headerRow.createEl('th', { text: '版本' })
			headerRow.createEl('th', { text: '操作' })

			const tbody = table.createEl('tbody')

			source.metadata.forEach((plugin) => {
				const row = tbody.createEl('tr')

				const nameCell = row.createEl('td')
				nameCell.createEl('span', { text: plugin.name })

				const versionCell = row.createEl('td')
				versionCell.createEl('span', { text: plugin.version })

				const actionCell = row.createEl('td')
				const buttonContainer = actionCell.createDiv()

				new ButtonComponent(buttonContainer)
					.setButtonText('安装')
					.setCta()
					.onClick(async () => {
						try {
							await this.download(plugin)
							// Add a simple success indicator
							const statusEl = buttonContainer.createEl('span', {
								text: ' ✓',
							})
							setTimeout(() => {
								statusEl.remove()
							}, 2000)
						} catch (error) {
							console.error('Failed to download plugin:', error)
							const statusEl = buttonContainer.createEl('span', {
								text: ' ✗',
							})
							setTimeout(() => {
								statusEl.remove()
							}, 2000)
						}
					})
			})
		}

		if (!hasAnyPlugins) {
			container.createEl('p', {
				text: '没有可用的插件。请先更新源元数据。',
			})
		}
	}

	private async download({ url, id }: SourceMetadata) {
		const resp = await requestUrl({
			url: url,
		}).arrayBuffer
		const { files } = await loadZipAsync(resp)
		const filePaths = Object.keys(files)
		const basePath = filePaths.sort((a, b) => a.length - b.length)[0]
		let newBasePath = normalizePath(join(this.plugin.manifest.dir!, '..', id))
		if (!newBasePath.endsWith('/')) {
			newBasePath += '/'
		}
		if (!(await this.app.vault.adapter.exists(newBasePath))) {
			await this.app.vault.adapter.mkdir(newBasePath)
		}
		for (let [p, f] of Object.entries(files)) {
			if (p === basePath) {
				continue
			}
			p = p.replace(basePath, newBasePath)

			if (f.dir) {
				await this.plugin.app.vault.adapter.mkdir(p)
			} else {
				await this.plugin.app.vault.adapter.writeBinary(
					p,
					await f.async('arraybuffer'),
				)
			}
		}
		const manifestFilePath = join(newBasePath, 'manifest.json')
		if (!(await this.app.vault.adapter.exists(manifestFilePath))) {
			return
		}
		const manifestFile = await this.app.vault.adapter.read(manifestFilePath)
		const manifest = JSON.parse(manifestFile)
		if (manifest.id) {
			this.reloadPlugin(manifest.id)
		}
	}

	/**
	 * https://github.com/TfTHacker/obsidian42-brat/blob/02fb9d5dd4258803629a956afed4ea8e6a584718/src/features/BetaPlugins.ts#L457
	 */
	async reloadPlugin(id: string): Promise<void> {
		// @ts-ignore
		const { plugins } = this.plugin.app
		try {
			await plugins.disablePlugin(id)
			await plugins.enablePlugin(id)
		} catch {}
	}

	onClose() {
		const { contentEl } = this
		contentEl.empty()
	}
}
