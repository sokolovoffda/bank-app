const BaseScreen = require('@/core/components/base-screen.component')
const renderService = require('@/core/services/render.service')
const Button = require('@/components/ui/button/button.component')
const Field = require('@/components/ui/field/field.component')

class AuthScreen extends BaseScreen {
	constructor() {
		super({ title: 'Auth' })
	}

	render() {
		return renderService.htmlToElement(
			`<section class="auth-stub">
				<h1>Auth</h1>
				<p>Auth screen stub.</p>
				<form>
					<component-field></component-field>
					<component-field></component-field>
					<component-button></component-button>
				</form>
			</section>`,
			[
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
					onClick: () => console.log('auth stub submit')
				})
			]
		)
	}

	destroy() {}
}

module.exports = AuthScreen
