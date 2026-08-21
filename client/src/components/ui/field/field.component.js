const ChildComponent = require('@/core/components/child.component')
const template = require('./field.template.html')
const renderService = require('@/core/services/render.service')

class Field extends ChildComponent {
	constructor({ placeholder, type = 'text', value = '', name, variant } = {}) {
		super()
		if (!name) throw new Error('Укажите name')
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
		input.name = this.name
		input.type = this.type
		input.placeholder = this.placeholder
		input.value = this.value

		return this.element
	}
}

module.exports = Field
