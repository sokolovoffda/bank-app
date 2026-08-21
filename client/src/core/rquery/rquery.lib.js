class RQuery {
	constructor(selector) {
		if (typeof selector === 'string') {
			this.element = document.querySelector(selector)
			if (!this.element) {
				throw new Error(`Element ${selector} not found!`)
			}
		} else if (selector instanceof HTMLElement) {
			this.element = selector
		} else {
			throw new Error('Invalid selector type')
		}
	}

	find(selector) {
		const found = this.element.querySelector(selector)
		if (!found) {
			throw new Error(`Element ${selector} not found!`)
		}
		return new RQuery(found)
	}

	findAll(selector) {
		return Array.from(this.element.querySelectorAll(selector)).map(
			el => new RQuery(el)
		)
	}

	append(childElement) {
		this.element.appendChild(childElement)
		return this
	}

	clear() {
		this.element.replaceChildren()
		return this
	}

	text(value) {
		if (typeof value === 'undefined') {
			return this.element.textContent
		}
		this.element.textContent = value
		return this
	}

	on(eventType, callback) {
		this.element.addEventListener(eventType, callback)
		return this
	}

	click(callback) {
		return this.on('click', callback)
	}

	submit(onSubmit) {
		if (this.element.tagName.toLowerCase() !== 'form') {
			throw new Error('Element must be a form')
		}
		this.element.addEventListener('submit', e => {
			e.preventDefault()
			onSubmit(e)
		})
		return this
	}

	input({ onInput, ...rest } = {}) {
		if (this.element.tagName.toLowerCase() !== 'input') {
			throw new Error('Element must be an input')
		}

		for (const [key, value] of Object.entries(rest)) {
			if (key === 'value') {
				this.element.value = value ?? ''
			} else if (value != null) {
				this.element.setAttribute(key, value)
			}
		}

		if (onInput) {
			this.element.addEventListener('input', onInput)
		}

		return this
	}

	addClass(classNames) {
		const list = Array.isArray(classNames) ? classNames : [classNames]
		for (const className of list) {
			this.element.classList.add(className)
		}
		return this
	}

	removeClass(classNames) {
		const list = Array.isArray(classNames) ? classNames : [classNames]
		for (const className of list) {
			this.element.classList.remove(className)
		}
		return this
	}

	attr(attributeName, value) {
		if (typeof attributeName !== 'string') {
			throw new Error('Attribute name must be a string')
		}
		if (typeof value === 'undefined') {
			return this.element.getAttribute(attributeName)
		}
		this.element.setAttribute(attributeName, value)
		return this
	}

	removeAttr(attributeName) {
		this.element.removeAttribute(attributeName)
		return this
	}
}

function $R(selector) {
	return new RQuery(selector)
}

module.exports = { $R, RQuery }
