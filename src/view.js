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
  const time = evt.created_at
  switch (evt.type) {
    case 'WatchEvent': { // user starred a repo
      const subject = { link: evt.actor.url, label: evt.actor.login }
      const verb = evt.payload.action
      const object = { link: evt.repo.url, label: evt.repo.name }
      return SimpleSentence(subject, verb, object, time)
    } case 'CreateEvent': {
      const subject = { link: evt.actor.url, label: evt.actor.login }

      const refType = evt.payload.ref_type
      let verb
      if (refType === 'branch' || refType === 'tag') {
        verb = html`<span>created ${evt.payload.ref_type} <code>${evt.payload.ref}</code> at</span>`
      } else if (refType === 'repository') {
        verb = 'created repository'
      }

      const object = { link: evt.repo.url, label: evt.repo.name }
      return SimpleSentence(subject, verb, object, time)
    }
  }
}

function SimpleSentence (subject, verb, object, time) {
  const timeago = new Timeago()

  return html`
    <li>
      <a href=${subject.link}>${subject.label}</a>
      ${verb}
      <a href=${object.link}>${object.label}</a>
      <abbr title=${time} class="time">${timeago.format(time)}</abbr>
    </li>
  `
}
