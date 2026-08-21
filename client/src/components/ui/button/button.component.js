const ChildComponent = require('@/core/components/child.component')
const template = require('./button.template.html')
const RenderService = require('@/core/services/render.service')

class Button extends ChildComponent {
	constructor({ children, onClick, variant } = {}) {
		super()
		if (!children) throw new Error('Children is empty!')
		this.children = children
		this.onClick = onClick
		this.variant = variant
	}

	static tag = 'button'
	render() {
		this.element = new RenderService().htmlToElement(template)
		this.element.textContent = this.children
		if (this.onClick) {
			this.element.addEventListener('click', this.onClick)
		}

		if (this.variant) {
			this.element.classList.add(`button--${this.variant}`)
		}
		return this.element
	}
}

module.exports = Button
