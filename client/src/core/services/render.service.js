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
		const tagPattern = /^component-/

		for (let element of elements) {
			const tagName = element.tagName.toLowerCase()
			if (!tagPattern.test(tagName)) continue
			const tag = tagName.replace(tagPattern, '')
			const index = pool.findIndex(c => {
				const componentTag = c.tag ?? c.constructor.tag
				return componentTag === tag
			})

			if (index === -1) {
				console.error(`Component "${tag}" not found`)
				continue
			}

			const Component = pool[index]
			const isInstance = Component instanceof ChildComponent
			if (isInstance) pool.splice(index, 1)

			const node = isInstance ? Component.render() : new Component().render()

			element.replaceWith(node)
		}
	}
}

module.exports = new RenderService()
