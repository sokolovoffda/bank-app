const BaseScreen = require('@/core/components/base-screen.component')
const RenderService = require('@/core/services/render.service')
const template = require('./auth.template.html')

class AuthScreen extends BaseScreen {
	constructor() {
		super({ title: 'Auth' })
	}

	render() {
		return new RenderService().htmlToElement(template)
	}

	destroy() {}
}

module.exports = AuthScreen
