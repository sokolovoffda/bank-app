const BaseScreen = require('@/core/components/base-screen.component')

class HomeScreen extends BaseScreen {
	constructor() {
		super({ title: 'Home' })
	}
	render() {
		return '<section><h1>Home</h1><p>Home screen stub.</p></section>'
	}

	destroy() {}
}

module.exports = HomeScreen
