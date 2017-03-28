const util = require('util')
const express = require('express')
const yelp = require('yelp-fusion')

const router = express.Router()

router.post('/search', (req, res, next) => {
  // Validate inputs
  req.assert('location', 'cannot be empty')
    .isAlphanumeric()
    .notEmpty()
  req.assert('term', 'must be alphanumeric')
    .optional()
    .isAlphanumeric()
  req.assert('limit', 'must be a number between 1 and 50')
    .optional()
    .isInt()
    .isFloat({
      min: 1,
      max: 50,
    })
  req.assert('offset', 'must be a number')
    .optional()
    .isInt()
  req.assert('latitude', 'must be a decimal number')
    .optional()
    .isDecimal()
  req.assert('longitude', 'must be a decimal number')
    .optional()
    .isDecimal()
  req.assert('open_now', 'must be a boolean (true or false)')
    .optional()
    .isBoolean()

  // Sanitize inputs
  req.sanitize('location').trim()
  req.sanitize('term').trim()
  req.sanitize('limit').toInt()
  req.sanitize('offset').toInt()
  req.sanitize('latitude').toFloat()
  req.sanitize('longitude').toFloat()
  req.sanitize('open_now').toBoolean()

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      res.status(400).json({ status: 400, error: result.array() })
      return
    }
    // Search
    const searchObject = {
      location: req.body.location,
    }

    if (req.body.term) searchObject.term = req.body.term
    if (req.body.limit) searchObject.limit = req.body.limit
    if (req.body.offset) searchObject.offset = req.body.offset
    if (req.body.latitude) searchObject.latitude = req.body.latitude
    if (req.body.longitude) searchObject.longitude = req.body.longitude
    if (req.body.price) searchObject.price = req.body.price
    if (req.body.open_now) searchObject.open_now = req.body.open_now

    req.yelpClient.search(searchObject).then((response) => {
      res.status(200).json({
        search: searchObject,
        response: response.jsonBody.businesses,
      })
    }).catch((err) => {
      console.error(err)
      res.status(406).json({ status: 406, error: err })
    })
  })
})

module.exports = router
