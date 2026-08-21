const BaseScreen = require('@/core/components/base-screen.component')
const renderService = require('@/core/services/render.service')
const template = require('./not-found.template.html')

class NotFoundScreen extends BaseScreen {
	constructor() {
		super({ title: 'Not found' })
	}

	render() {
		return renderService.htmlToElement(template)
	}

	destroy() {}
}

module.exports = NotFoundScreen
