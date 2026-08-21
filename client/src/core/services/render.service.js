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
		const pool = [...components]
		const elements = Array.from(root.querySelectorAll('*'))

		for (const element of elements) {
			const tagName = element.tagName.toLowerCase()
			if (!tagName.startsWith('component-')) continue

			const tag = tagName.replace(/^component-/, '')
			const index = pool.findIndex(component => {
				const componentTag = component.tag ?? component.constructor.tag
				return componentTag === tag
			})

			if (index === -1) {
				console.error(`Component "${tag}" not found`)
				continue
			}

			const Component = pool[index]
			const isInstance = Component instanceof ChildComponent

			if (isInstance) pool.splice(index, 1)

			const node = isInstance
				? Component.render()
				: new Component().render()

			element.replaceWith(node)
		}
	}
}

module.exports = new RenderService()
