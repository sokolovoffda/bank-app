class BaseScreen {
	constructor({ title }) {
		if (title) document.title = title
	}

	render() {
		throw new Error('Method render not found')
	}

	destroy() {}
}

module.exports = BaseScreen
