const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const timeout = require('connect-timeout')
const compression = require('compression')
// const favicon = require('serve-favicon')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
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

// Use routers
app.use('/', site)

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