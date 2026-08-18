class Layout {
  render() {
    return `
      <div class="layout">
        <header class="layout__header">
          <nav class="layout__nav">
            <a href="/" data-link>Home</a>
            <a href="/auth" data-link>Auth</a>
            <a href="/about-us" data-link>About</a>
          </nav>
        </header>
        <main id="content" class="layout__content"></main>
      </div>
    `
  }
}

module.exports = Layout
