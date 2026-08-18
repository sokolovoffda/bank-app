const BaseScreen = require('@/core/components/base-screen.component')

class AboutScreen extends BaseScreen {
	constructor() {
		super({ title: 'About' })
	}

	render() {
		return '<section><h1>About</h1><p>About screen stub.</p></section>'
	}

	destroy() {}
}

module.exports = AboutScreen
