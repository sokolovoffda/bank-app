const ChildComponent = require('@/core/components/child.component')
const renderService = require('@/core/services/render.service')
const template = require('./field.template.html')

class Field extends ChildComponent {
	constructor({ placeholder, type = 'text', value = '', name, variant } = {}) {
		super()
		if (!name) throw new Error('Please fill field "name"!')

		this.placeholder = placeholder
		this.type = type
		this.value = value
		this.name = name
		this.variant = variant
	}

	static tag = 'field'

	render() {
		this.element = renderService.htmlToElement(template)

		const input = this.element.querySelector('input')
		input.placeholder = this.placeholder || ''
		input.type = this.type
		input.value = this.value
		input.name = this.name

		if (this.variant) {
			this.element.classList.add(`field--${this.variant}`)
		}

		return this.element
	}
}

module.exports = Field
