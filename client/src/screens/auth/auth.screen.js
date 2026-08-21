const BaseScreen = require('@/core/components/base-screen.component')
const renderService = require('@/core/services/render.service')
const { $R } = require('@/core/rquery/rquery.lib')
const Field = require('@/components/ui/field/field.component')
const Button = require('@/components/ui/button/button.component')
const template = require('./auth.template.html')

class AuthScreen extends BaseScreen {
	constructor() {
		super({ title: 'Auth' })
	}

	#handleSubmit = e => {
		const form = e.target
		const data = new FormData(form)
		console.log({
			email: data.get('email'),
			password: data.get('password')
		})
	}

	render() {
		this.element = renderService.htmlToElement(template, [
			new Field({
				placeholder: 'Enter email',
				name: 'email',
				type: 'email'
			}),
			new Field({
				placeholder: 'Enter password',
				name: 'password',
				type: 'password'
			}),
			new Button({
				children: 'Submit',
				variant: 'purple',
				type: 'submit'
			})
		])

		$R(this.element).find('#auth').submit(this.#handleSubmit)

		return this.element
	}

	destroy() {}
}

module.exports = AuthScreen
