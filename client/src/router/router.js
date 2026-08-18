const Layout = require('../layout/layout')
const routes = require('./routes.data')

class Router {
	constructor(rootElement) {
		this.rootElement = rootElement
		this.layout = new Layout()
		this.currentScreen = null
	}

	init() {
		this.rootElement.innerHTML = this.layout.render()
	}
}

module.exports = Router
