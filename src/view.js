const html = require('choo/html')
const css = require('sheetify')

const Nav = require('./components/nav')
const Events = require('./components/events')
const Intro = require('./components/intro')

css('bulma/css/bulma.css')

const prefix = css`
  .section {
    padding-top: 10px;
  }
  ul > li {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px #f1f1f1 solid;
  }
  abbr.time {
    font-size: 80%;
    color: #777;
  }
`

module.exports = (state, prev, send) => {
  return html`
    <main class=${prefix}>
      ${Nav(state.user, loginCb)}
      <section class="section">
        ${state.user.login
          ? html`
            <div class="container">
              <ul onload=${onLoadEvents}>
                ${state.events.map(EventIfExists)}
              </ul>
              <a href="#" class="button is-primary" onclick=${onClickNext}>
                Next page
              </a>
            </div>
          ` : Intro()}
      </section>
    </main>
  `
  function loginCb () {
    send('login')
  }
  function onLoadEvents () {
    send('fetchEvents')
  }
  function onClickNext (evt) {
    send('fetchEvents', { page: state.page + 1 })
    evt.preventDefault()
    evt.stopPropagation()
  }
}

function EventIfExists (evt) {
  if (Events[evt.type]) {
    return Events[evt.type](evt)
  } else {
    return ''
  }
}
