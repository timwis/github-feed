const html = require('choo/html')
const Timeago = require('timeago.js')

exports.WatchEvent = (evt) => {
  return html`
    <li>
      ${GitHubLink(evt.actor.login)}
      ${evt.payload.action}
      ${GitHubLink(evt.repo.name)}
      ${TimeagoAbbr(evt.created_at)}
    </li>
  `
}

exports.CreateEvent = (evt) => {
  const refType = evt.payload.ref_type
  let verb
  if (refType === 'branch' || refType === 'tag') {
    verb = html`
      <span>
        created ${evt.payload.ref_type} <code>${evt.payload.ref}</code> at
      </span>
    `
  } else if (refType === 'repository') {
    verb = 'created repository'
  }

  return html`
    <li>
      ${GitHubLink(evt.actor.login)}
      ${verb}
      ${GitHubLink(evt.repo.name)}
      ${TimeagoAbbr(evt.created_at)}
    </li>
  `
}

function GitHubLink (path) {
  return html`
    <a href="https://github.com/${path}">${path}</a>
  `
}

function TimeagoAbbr (timestamp) {
  const timeago = new Timeago().format(timestamp)
  return html`
    <abbr title=${timestamp} class="time">${timeago}</abbr>
  `
}
