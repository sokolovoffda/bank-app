class Store {
	constructor() {
		this.state = { user: null }
	}

	getState() {
		return this.state
	}
}

module.exports = new Store()
