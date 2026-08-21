const BaseScreen = require('@/core/components/base-screen.component')
const RenderService = require('@/core/services/render.service')
const template = require('./about.template.html')

class AboutScreen extends BaseScreen {
	constructor() {
		super({ title: 'About' })
	}

	render() {
		return new RenderService().htmlToElement(template)
	}

	destroy() {}
}

module.exports = AboutScreen
