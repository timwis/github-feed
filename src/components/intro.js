const html = require('choo/html')

module.exports = (loginCb) => {
  return html`
    <div class="container">
      <p>
        Mobile-friendly GitHub activity feed. Check who starred what while on the go.
        <a href="#" onclick=${onClickLogin}>Login</a> to view your feed.
      </p>
    </div>
  `
  function onClickLogin (evt) {
    if (loginCb) loginCb()
    evt.preventDefault()
    evt.stopPropagation()
  }
}
