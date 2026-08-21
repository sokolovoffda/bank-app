const Button = require('@/components/ui/button/button.component')
const BaseScreen = require('@/core/components/base-screen.component')
const RenderService = require('@/core/services/render.service')
const template = require('./home.template.html')
const Field = require('@/components/ui/field/field.component')

class HomeScreen extends BaseScreen {
	constructor() {
		super({ title: 'Home' })
	}
	render() {
		const element = RenderService.htmlToElement(template, [
			new Button({
				children: 'test',
				onClick: () => console.log(123),
				variant: 'green'
			}),
			new Field({
				name: 'test',
				placeholder: 'Введите текст'
			})
		])
		return element
	}

	destroy() {}
}

module.exports = HomeScreen
