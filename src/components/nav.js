const html = require('choo/html')

module.exports = (user, loginCb) => {
  return html`
    <nav class="nav">
      <div class="nav-left">
        <a href="#" class="nav-item is-brand">
          Serverless Data
        </a>
      </div>

      <div class="nav-right nav-menu">
        <span class="nav-item">
          <a class="button" onclick=${onClickLogin}>
            Login
          </a>
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
