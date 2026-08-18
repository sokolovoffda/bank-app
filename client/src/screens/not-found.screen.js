const BaseScreen = require('../core/components/base-screen.component')

class NotFoundScreen extends BaseScreen {
	constructor() {
		super({ title: 'Not found' })
	}

	render() {
		return '<section><h1>Not found</h1><p>Route does not exist.</p></section>'
	}

	destroy() {}
}

module.exports = NotFoundScreen
