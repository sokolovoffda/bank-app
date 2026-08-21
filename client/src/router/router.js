const Button = require('@/components/ui/button/button.component')
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
		content.replaceChildren(this.currentScreen.render())
	}
}

module.exports = Router
