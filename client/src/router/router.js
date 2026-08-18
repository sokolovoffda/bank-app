const Layout = require('../layout/layout')
const routes = require('./routes.data')
const renderService = require('../core/services/render.service')
class Router {
	constructor(rootElement) {
		this.rootElement = rootElement
		this.layout = new Layout()
		this.currentScreen = null
	}

	init() {
		this.rootElement.innerHTML = this.layout.render()
		const el = renderService.htmlToElement('<section><h1>Home</h1></section>')
		console.log(el) // <section>...</section>
		console.log(el.tagName) // SECTION
		document.addEventListener('click', e => {
			const link = e.target.closest('a[data-link]')
			const path = link ? link.getAttribute('href') : null
			if (path) {
				e.preventDefault()
				history.pushState({}, '', path)
				this.#renderRoute(path)
			} else return
		})

		window.addEventListener('popstate', () => {
			this.#renderRoute(window.location.pathname)
		})

		this.#renderRoute(window.location.pathname)
	}
	#renderRoute(path) {
		const contentWrapper = document.getElementById('content')
		const route = routes.find(el => el.path === path)
		const notFoundPage = routes.find(el => el.path === '*')

		if (!route) {
			contentWrapper.innerHTML = new notFoundPage.Screen().render()
			return
		}

		contentWrapper.innerHTML = new route.Screen().render()
	}
}

module.exports = Router
