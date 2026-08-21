const BaseScreen = require('@/core/components/base-screen.component')
const renderService = require('@/core/services/render.service')
const Button = require('@/components/ui/button/button.component')

class HomeScreen extends BaseScreen {
	constructor() {
		super({ title: 'Home' })
	}

	render() {
		return renderService.htmlToElement(
			`<section><h1>Home</h1><p>Home screen stub.</p> <component-button></component-button> </section>`,
			[
				new Button({
					children: 'test',
					onClick: () => console.log(123)
				})
			]
		)
	}

	destroy() {}
}

module.exports = HomeScreen
