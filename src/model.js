const xhr = require('xhr')
const qs = require('query-string')
const parallel = require('run-parallel')
const series = require('run-series')
const Cookies = require('js-cookie')
const GitHub = require('github-api')

const config = {
  GITHUB_AUTH_URL: 'https://github.com/login/oauth/authorize',
  GITHUB_CLIENT: '1d8f959ece6eb757b542',
  GATEKEEPER_HOST: 'https://github-feed-gatekeeper.herokuapp.com'
}

module.exports = {
  state: {
    token: '',
    user: {},
    events: [],
    page: 1
  },
  reducers: {
    receiveToken: (state, token) => ({ token }),
    receiveUser: (state, user) => ({ user }),
    receiveEvents: (state, data) => {
      return {
        page: data.page,
        events: [...state.events, ...data.events]
      }
    }
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
    },
    fetchEvents: (state, data, send, done) => {
      const page = data && data.page ? data.page : 1
      const username = state.user.login
      const url = `https://api.github.com/users/${username}/received_events?page=${page}`
      xhr(url, { json: true }, (err, res, body) => {
        if (err || res.statusCode !== 200) return done(new Error('Failed to fetch events'))
        send('receiveEvents', { page, events: body }, done)
      })
    }
  },
  subscriptions: {
    checkAuthCode: (send, done) => {
      const authCodeMatch = window.location.href.match(/\?code=([a-z0-9]*)/)
      if (authCodeMatch) {
        const authCode = authCodeMatch[1]
        series([
          (cb) => send('fetchToken', authCode, cb),
          (cb) => send('fetchUser', cb)
        ], done)
      }
    },
    checkCookie: (send, done) => {
      const token = Cookies.get('token')
      if (token) {
        series([
          (cb) => send('receiveToken', token, cb),
          (cb) => send('fetchUser', cb)
        ], done)
      }
    }
  }
}
