const ChildComponent = require('@/core/components/child.component')
const renderService = require('@/core/services/render.service')
const { $R } = require('@/core/rquery/rquery.lib')
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

		$R(this.element).find('input').input({
			placeholder: this.placeholder || '',
			type: this.type,
			value: this.value,
			name: this.name
		})

		if (this.variant) {
			$R(this.element).addClass(`field--${this.variant}`)
		}

		return this.element
	}
}

module.exports = Field
