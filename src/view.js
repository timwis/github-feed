const html = require('choo/html')
const css = require('sheetify')
const Timeago = require('timeago.js')

const Nav = require('./components/nav')

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
        <div class="container">
          <ul>
            ${state.events.map(Event)}
          </ul>
        </div>
      </section>
    </main>
  `
  function loginCb () {
    send('login')
  }
}

function Event (evt) {
  const gh = 'https://github.com'
  const timeago = new Timeago().format(evt.created_at)
  switch (evt.type) {
    case 'WatchEvent': { // user starred a repo
      return html`
        <li>
          <a href="${gh}/${evt.actor.login}">${evt.actor.login}</a>
          ${evt.payload.action}
          <a href="${gh}/${evt.repo.name}">${evt.repo.name}</a>
          <abbr title=${evt.created_at} class="time">${timeago}</abbr>
        </li>
      `
    } case 'CreateEvent': {
      const refType = evt.payload.ref_type
      let verb
      if (refType === 'branch' || refType === 'tag') {
        verb = html`<span>created ${evt.payload.ref_type} <code>${evt.payload.ref}</code> at</span>`
      } else if (refType === 'repository') {
        verb = 'created repository'
      }

      return html`
        <li>
          <a href="${gh}/${evt.actor.login}">${evt.actor.login}</a>
          ${verb}
          <a href="${gh}/${evt.repo.name}">${evt.repo.name}</a>
          <abbr title=${evt.created_at} class="time">${timeago}</abbr>
        </li>
      `
    }
  }
}
