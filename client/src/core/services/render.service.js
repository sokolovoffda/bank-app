const ChildComponent = require('../components/child.component')

class RenderService {
	htmlToElement(html, components = []) {
		const template = document.createElement('template')
		template.innerHTML = html.trim()
		const element = template.content.firstElementChild
		this.#replaceComponentTags(element, components)
		return element
	}

	#replaceComponentTags(root, components) {
		const elements = Array.from(root.querySelectorAll('*'))
		for (const element of elements) {
			const tagName = element.tagName.toLowerCase()
			if (!tagName.startsWith('component-')) continue

			const tag = tagName.replace(/^component-/, '')

			const Component = components.find(
				component => component.tag ?? component.constructor.tag
			)

			if (!Component) {
				console.error(`Component "${tag}" not found`)
				continue
			}

			const node =
				Component instanceof ChildComponent
					? Component.render()
					: new Component().render()

			element.replaceWith(node)
		}
	}
}

module.exports = new RenderService()
