const BaseScreen = require('@/core/components/base-screen.component')
const RenderService = require('@/core/services/render.service')
const template = require('./not-found.template.html')

class NotFoundScreen extends BaseScreen {
	constructor() {
		super({ title: 'Not Found' })
	}

	render() {
		return new RenderService().htmlToElement(template)
	}

	destroy() {}
}

module.exports = NotFoundScreen
