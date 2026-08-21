class ChildComponent {
	render() {
		throw new Error('Method render not found')
	}

	static get tag() {
		throw new Error('Tag not found')
	}
}
module.exports = ChildComponent
