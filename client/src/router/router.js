const Layout = require('@/layout/layout')
const routes = require('@/router/routes.data')
const { $R } = require('@/core/rquery/rquery.lib')

class Router {
	constructor(rootElement) {
		this.rootElement = rootElement
		this.layout = new Layout()
		this.currentScreen = null
	}

	init() {
		this.rootElement.innerHTML = this.layout.render()

		$R(this.rootElement).on('click', e => {
			const link = e.target.closest('a[data-link]')
			const path = link ? link.getAttribute('href') : null
			if (!path) return

			e.preventDefault()
			history.pushState({}, '', path)
			this.#renderRoute(path)
		})

		window.addEventListener('popstate', () => {
			this.#renderRoute(window.location.pathname)
		})

		this.#renderRoute(window.location.pathname)
	}

	#renderRoute(path) {
		const route = routes.find(el => el.path === path)
		const notFoundPage = routes.find(el => el.path === '*')
		const Screen = route ? route.Screen : notFoundPage.Screen

		this.currentScreen?.destroy()
		this.currentScreen = new Screen()

		$R('#content').clear().append(this.currentScreen.render())
	}
}

module.exports = Router
