require('newrelic')
const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const timeout = require('connect-timeout')
const expressValidator = require('express-validator')
const compression = require('compression')
const yelp = require('yelp-fusion')

const environment = process.env.NODE_ENV

const CLIENT_ID = process.env.YELP_ID
const CLIENT_SECRET = process.env.YELP_SECRET

var yelpClient

if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('Yelp API keys not set')

// Generate access token
const token = yelp.accessToken(CLIENT_ID, CLIENT_SECRET).then((response) => {
  console.log('Making yelp client')
  yelpClient = yelp.client(response.jsonBody.access_token)
}).catch((err) => {
  throw new Error(err)
})

const app = express()

app.use(logger(environment === 'production' ? 'common' : 'dev'))
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())
// Cookies
app.use(cookieParser())

app.use((req, res, next) => {
  console.log('Attaching yelp client')
  req.yelpClient = yelpClient
  next()
})

// Close timed out connections
app.use(timeout(120000))
const haltOnTimedout = (req, res, next) => {
  if (!req.timedout) next()
}
app.use(haltOnTimedout)

// Import routers
const api = require('./routes/api')

// Use routers
app.use('/api/v1/', api)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handler
app.use((err, req, res) => {
  // Set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // Render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
