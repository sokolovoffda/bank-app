const BaseScreen = require('@/core/components/base-screen.component')
const renderService = require('@/core/services/render.service')
const Button = require('@/components/ui/button/button.component')
const template = require('./home.template.html')

class HomeScreen extends BaseScreen {
	constructor() {
		super({ title: 'Home' })
	}

	render() {
		return renderService.htmlToElement(template, [
			new Button({
				children: 'test',
				variant: 'green',
				onClick: () => console.log(123)
			})
		])
	}

	destroy() {}
}

module.exports = HomeScreen
