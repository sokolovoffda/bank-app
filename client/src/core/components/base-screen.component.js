class BaseScreen {
	constructor({ title }) {
		if (title) document.title = title
	}
	render() {
		throw new Error('Render method must be implemented')
	}
	destroy() {}
}

module.exports = BaseScreen
