const xhr = require('xhr')
const qs = require('query-string')
const parallel = require('run-parallel')
const Cookies = require('js-cookie')

const config = {
  GITHUB_AUTH_URL: 'https://github.com/login/oauth/authorize',
  GITHUB_CLIENT: '1d8f959ece6eb757b542',
  GATEKEEPER_HOST: 'http://localhost:9999'
}

module.exports = {
  state: {
    token: '',
    user: {}
  },
  reducers: {
    receiveToken: (token, state) => ({ token }),
    receiveUser: (state, user) => ({ user })
  },
  effects: {
    login: (state, data, send, done) => {
      const params = {
        client_id: config.GITHUB_CLIENT,
        redirect_url: window.location.href,
        scope: 'public_repo'
      }
      const url = config.GITHUB_AUTH_URL + '?' + qs.stringify(params)
      window.location.href = url
    },
    fetchToken: (state, authCode, send, done) => {
      const authURL = `${config.GATEKEEPER_HOST}/authenticate/${authCode}`

      xhr(authURL, { json: true }, (err, res, body) => {
        if (err || res.statusCode !== 200) return done(new Error('Failed to retrieve token'))
        window.history.pushState({}, null, '/') // remove code from URL
        parallel([
          (cb) => send('persistToken', body.token, cb),
          (cb) => send('receiveToken', body.token, cb)
        ], done)
      })
    },
    persistToken: (state, token, send, done) => {
      Cookies.set('token', token)
      done()
    },
    fetchUser: (state, data, send, done) => {
      const user = new GitHub({ token: state.token }).getUser()
      user.getProfile((err, result) => {
        if (err) return done(new Error('Failed to fetch user profile'))
        send('receiveUser', result, done)
      })
    }
  },
  subscriptions: {
    checkAuthCode: (send, done) => {
      const authCodeMatch = window.location.href.match(/\?code=([a-z0-9]*)/)
      if (authCodeMatch) {
        const authCode = authCodeMatch[1]
        send('fetchToken', authCode, done)
      }
    },
    checkCookie: (send, done) => {
      const token = Cookies.get('token')
      if (token) send('receiveToken', token, done)
    }
  }
}
