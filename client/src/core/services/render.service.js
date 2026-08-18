class RenderService {
	htmlToElement(html) {
		const template = document.createElement('template')
		template.innerHTML = html.trim()
		return template.content.firstElementChild
	}
}

module.exports = new RenderService()
