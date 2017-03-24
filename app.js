const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const timeout = require('connect-timeout')
const compression = require('compression')
const yelp = require('yelp-fusion')
// const favicon = require('serve-favicon')

const environment = process.env.NODE_ENV

const CLIENT_ID =
  process.env.YELP_ID ||
  'LwyO2ipJjCw8Sro-cH6uAg'
const CLIENT_SECRET =
  process.env.YELP_SECRET ||
  '5Z2wbtMFIBby6YuuJ1rZtQTz5Bd0qDPR67fN6f0qeZ1CDGbuSp6DRKA5AD4oS8e9'

var yelpClient

// Generate access token
const token = yelp.accessToken(CLIENT_ID, CLIENT_SECRET).then((response) => {
  console.log('Making yelp client')
  yelpClient = yelp.client(response.jsonBody.access_token)
}).catch((err) => {
  throw new Error(err)
})

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Uncomment after placing your favicon in /puWblic
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger(environment === 'production' ? 'common' : 'dev'))
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// Cookies
app.use(cookieParser())
// Allows us to use SCSS instead of CSS
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true,
}))

app.use((req, res, next) => {
  console.log('Attaching yelp client')
  req.yelpClient = yelpClient
  next()
})

// Server static files in the public directory under /
app.use(express.static(path.join(__dirname, 'public')))

// Close timed out connections
app.use(timeout(120000))
const haltOnTimedout = (req, res, next) => {
  if (!req.timedout) next()
}
app.use(haltOnTimedout)

// Import routers
const site = require('./routes/site')
const api = require('./routes/api')

// Use routers
app.use('/', site)
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
