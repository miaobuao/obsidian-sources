import { ButtonComponent, Modal, Setting } from 'obsidian'
import SourcesPlugin from '../index'
import Source from '../model/source'

export default class SourceEditModal extends Modal {
	private source: Source
	private onSave: (source: Source) => void
	private urlValue: string = ''

	constructor(
		private plugin: SourcesPlugin,
		sourceToEdit: Source | null,
		onSave: (source: Source) => void,
	) {
		super(plugin.app)
		this.source = sourceToEdit || { url: '' }
		this.urlValue = this.source.url
		this.onSave = onSave
	}

	onOpen() {
		const { contentEl } = this
		contentEl.empty()

		contentEl.createEl('h2', {
			text: this.source.url ? '编辑源' : '添加源',
		})

		const formContainer = contentEl.createDiv()

		new Setting(formContainer)
			.setName('源 URL')
			.setDesc('输入源的 URL 地址')
			.addText((text) => {
				text.setValue(this.urlValue).onChange((value) => {
					this.urlValue = value
				})
			})

		const buttonContainer = contentEl.createDiv()

		new ButtonComponent(buttonContainer)
			.setButtonText('取消')
			.onClick(() => {
				this.close()
			})

		new ButtonComponent(buttonContainer)
			.setButtonText('保存')
			.setCta()
			.onClick(() => {
				const updatedSource: Source = { url: this.urlValue.trim() }
				this.onSave(updatedSource)
				this.close()
			})
	}

	onClose() {
		const { contentEl } = this
		contentEl.empty()
	}
}
