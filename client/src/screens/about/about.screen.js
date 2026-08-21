const BaseScreen = require('@/core/components/base-screen.component')
const renderService = require('@/core/services/render.service')
const template = require('./about.template.html')

class AboutScreen extends BaseScreen {
	constructor() {
		super({ title: 'About' })
	}

	render() {
		return renderService.htmlToElement(template)
	}

	destroy() {}
}

module.exports = AboutScreen
