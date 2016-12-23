const html = require('choo/html')

module.exports = (user, loginCb) => {
  return html`
    <nav class="nav">
      <div class="nav-left">
        <a href="#" class="nav-item is-brand">
          GitHub Feed
        </a>
      </div>

      <div class="nav-right">
        <span class="nav-item">
          ${user.login
            ? html`<span>${user.login}</span>`
            : html`
              <a class="button" onclick=${onClickLogin}>
                Login
              </a>
            `}
        </span>
      </div>
    </nav>
  `
  function onClickLogin (e) {
    if (loginCb) loginCb()
    e.preventDefault()
    e.stopPropagation()
  }
}
