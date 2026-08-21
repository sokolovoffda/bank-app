const BaseScreen = require('@/core/components/base-screen.component')
const RenderService = require('@/core/services/render.service')
const template = require('./auth.template.html')
const Field = require('@/components/ui/field/field.component')
const Button = require('@/components/ui/button/button.component')

class AuthScreen extends BaseScreen {
	constructor() {
		super({ title: 'Auth' })
	}

	render() {
		this.element = RenderService.htmlToElement(template, [
			new Field({
				placeholder: 'Введите email',
				type: 'email',
				name: 'email'
			}),
			new Field({
				placeholder: 'Введите пароль',
				name: 'password',
				type: 'password'
			}),
			new Button({
				children: 'Войти',
				variant: 'green',
				type: 'submit'
			})
		])

		const form = this.element.querySelector('#auth')
		form.addEventListener('submit', e => {
			e.preventDefault()
			const data = new FormData(form)
			console.log({
				email: data.get('email'),
				password: data.get('password')
			})
		})

		return this.element
	}

	destroy() {}
}

module.exports = AuthScreen
