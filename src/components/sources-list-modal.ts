import { ButtonComponent, Modal } from 'obsidian'
import SourceEditModal from '../components/source-edit-modal'
import SourcesPlugin from '../index'
import Source from '../model/source'

export default class SourcesListModal extends Modal {
	constructor(
		private plugin: SourcesPlugin,
		private onCloseCallback: () => void,
	) {
		super(plugin.app)
	}

	onOpen() {
		const { contentEl } = this
		contentEl.empty()
		contentEl.createEl('h2', { text: '源列表' })

		const sourceListContainer = contentEl.createDiv()

		this.renderSourcesList(sourceListContainer)

		const buttonContainer = contentEl.createDiv()

		new ButtonComponent(buttonContainer)
			.setButtonText('添加源')
			.onClick(() => {
				new SourceEditModal(this.plugin, null, (source: Source) => {
					this.plugin.settings.sourcesList.push(source)
					this.plugin.saveSettings()
					this.renderSourcesList(sourceListContainer)
				}).open()
			})

		new ButtonComponent(buttonContainer)
			.setButtonText('关闭')
			.onClick(() => {
				this.close()
			})
	}

	private renderSourcesList(container: HTMLElement) {
		container.empty()

		const { sourcesList } = this.plugin.settings

		if (sourcesList.length === 0) {
			container.createEl('p', {
				text: '没有添加任何源。请点击"添加源"按钮添加新的源。',
			})
			return
		}

		const table = container.createEl('table')
		const thead = table.createEl('thead')
		const headerRow = thead.createEl('tr')
		headerRow.createEl('th', { text: '源 URL' })
		headerRow.createEl('th', { text: '操作' })

		const tbody = table.createEl('tbody')

		sourcesList.forEach((source, index) => {
			const row = tbody.createEl('tr')

			const urlCell = row.createEl('td')
			urlCell.createEl('span', { text: source.url })

			const actionCell = row.createEl('td')

			const buttonContainer = actionCell.createDiv()

			new ButtonComponent(buttonContainer)
				.setButtonText('编辑')
				.setClass('mod-sm')
				.onClick(() => {
					new SourceEditModal(
						this.plugin,
						source,
						(updatedSource: Source) => {
							this.plugin.settings.sourcesList[index] =
								updatedSource
							this.plugin.saveSettings()
							this.renderSourcesList(container)
						},
					).open()
				})

			new ButtonComponent(buttonContainer)
				.setButtonText('删除')
				.setClass('mod-sm')
				.setWarning()
				.onClick(() => {
					if (confirm(`确认要删除源 ${source.url} 吗？`)) {
						this.plugin.settings.sourcesList.splice(index, 1)
						this.plugin.saveSettings()
						this.renderSourcesList(container)
					}
				})
		})
	}

	onClose() {
		const { contentEl } = this
		contentEl.empty()
		if (this.onCloseCallback) this.onCloseCallback()
	}
}
