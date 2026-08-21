const Layout = require('@/layout/layout')
const routes = require('./routes.data')

class Router {
	constructor(rootElement) {
		this.rootElement = rootElement
		this.layout = new Layout()
		this.currentScreen = null
	}

	init() {
		this.rootElement.innerHTML = this.layout.render()

		this.rootElement.addEventListener('click', e => {
			e.preventDefault()
			const link = e.target.closest('a[data-link]')
			if (!link) return

			const path = link.getAttribute('href')

			if (path) {
				history.pushState({}, '', path)
				this.#renderService(path)
			}
		})

		document.addEventListener('popstate', () => {
			this.#renderService(window.location.pathname)
		})

		this.#renderService(window.location.pathname)
	}

	#renderService(path) {
		console.log(path)
	}
}

module.exports = Router
