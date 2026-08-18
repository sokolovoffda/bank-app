class ChildComponent {
	render() {
		throw new Error('Render method must be implemented')
	}
	static get tag() {
		throw new Error('static tag must be defined')
	}
	destroy() {}
}

module.exports = ChildComponent
