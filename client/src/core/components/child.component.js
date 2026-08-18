class ChildComponent {
	render() {
		throw new Error('Render method must be implemented')
	}
	destroy() {}
}

module.exports = ChildComponent
