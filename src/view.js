const html = require('choo/html')

const Nav = require('./components/nav')

module.exports = (state, prev, send) => {
  return html`
    <main>
      ${Nav({}, loginCb)}
      <section class="section">
        <div class="container">
          Hello, world ${state.token}
        </div>
      </section>
    </main>
  `
  function loginCb () {
    send('login')
  }
}
