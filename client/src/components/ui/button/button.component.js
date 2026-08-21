const ChildComponent = require('@/core/components/child.component')
const renderService = require('@/core/services/render.service')
const template = require('./button.template.html')

class Button extends ChildComponent {
	constructor({ children, onClick }) {
		super()
		this.children = children
		this.onClick = onClick
		this.element = renderService.htmlToElement(template)
	}

	static tag = 'button'

	render() {
		this.element.textContent = this.children
		return this.element
	}
}

module.exports = Button
