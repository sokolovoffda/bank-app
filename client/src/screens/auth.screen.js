const BaseScreen = require('@/core/components/base-screen.component')

class AuthScreen extends BaseScreen {
	constructor() {
		super({ title: 'Auth' })
	}

	render() {
		return '<section><h1>Auth</h1><p>Auth screen stub.</p></section>'
	}

	destroy() {}
}

module.exports = AuthScreen
