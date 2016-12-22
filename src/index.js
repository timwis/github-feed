const choo = require('choo')

const app = choo()

if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-log')())
}

app.model(require('./model'))

app.router([
  ['/', require('./view')]
])

const tree = app.start()
document.body.appendChild(tree)
