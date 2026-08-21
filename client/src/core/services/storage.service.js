class StorageService {
	get(key) {
		if (!key) throw new Error('Необходим ключ')
		const value = localStorage.getItem(key)
		return value ? JSON.parse(value) : null
	}
	set(key, value) {
		if (!key) throw new Error('Нужен ключ')
		if (typeof value === 'undefined') throw new Error('Нужно значение')
		localStorage.setItem(key, JSON.stringify(value))
	}
	remove(key) {
		localStorage.removeItem(key)
	}
}

module.exports = new StorageService()
