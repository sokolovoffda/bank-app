const BaseScreen = require('@/core/components/base-screen.component')
const renderService = require('@/core/services/render.service')

class AboutScreen extends BaseScreen {
	constructor() {
		super({ title: 'About' })
	}

	render() {
		return renderService.htmlToElement(
			'<section><h1>About</h1><p>About screen stub.</p></section>'
		)
	}

	destroy() {}
}

module.exports = AboutScreen
