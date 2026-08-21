const RenderService = require('@/core/services/render.service')
const Layout = require('@/layout/layout')
const routes = require('@/router/routes.data')
class Router {
	constructor(rootElement) {
		this.rootElement = rootElement
		this.layout = new Layout()
		this.currentScreen = null
	}

	init() {
		this.rootElement.innerHTML = this.layout.render()
		new RenderService().htmlToElement(
			`<section>
        <div>Test</div>
        <component-button></component-button>
      </section>`
		)

		this.rootElement.addEventListener('click', e => {
			const link = e.target.closest('a[data-link]')
			const path = link ? link.getAttribute('href') : null

			if (path) {
				e.preventDefault()
				history.pushState({}, '', path)
				this.#renderRoute(path)
			}
		})

		document.addEventListener('popstate', () => {
			this.#renderRoute(window.location.pathname)
		})

		this.#renderRoute(window.location.pathname)
	}

	#renderRoute(path) {
		const content = document.querySelector('#content')
		let route = routes.find(rout => rout.path === path)
		if (!route) route = routes.find(rout => rout.path === '*')

		this.currentScreen?.destroy()
		this.currentScreen = new route.Screen()
		content.innerHTML = this.currentScreen.render()
	}
}

module.exports = Router
