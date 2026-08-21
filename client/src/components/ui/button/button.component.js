const ChildComponent = require('@/core/components/child.component')
const renderService = require('@/core/services/render.service')
const { $R } = require('@/core/rquery/rquery.lib')
const template = require('./button.template.html')

class Button extends ChildComponent {
	constructor({ children, onClick, variant, type = 'button' } = {}) {
		super()
		if (!children) throw new Error('Children is empty!')

		this.children = children
		this.onClick = onClick
		this.variant = variant
		this.type = type
	}

	static tag = 'button'

	render() {
		this.element = renderService.htmlToElement(template)

		const $button = $R(this.element).text(this.children).attr('type', this.type)

		if (this.onClick) {
			$button.click(this.onClick)
		}

		if (this.variant) {
			$button.addClass(`button--${this.variant}`)
		}

		return this.element
	}
}

module.exports = Button
