const util = require('util')
const express = require('express')
const yelp = require('yelp-fusion')

const router = express.Router()

router.post('/search', (req, res, next) => {
  // Validate inputs
  req.assert('location', 'Invalid param: location')
    .isAlphanumeric()
    .notEmpty()
  req.assert('term', 'Invalid param: term')
    .optional()
    .isAlphanumeric()
    .notEmpty()
  req.assert('limit', 'Invalid param: limit')
    .optional()
    .isInt()
    .lesserOrEqual(50)
  req.assert('offset', 'Invalid param: offset')
    .optional()
    .isInt()

  // Sanitize inputs
  req.sanitize('location').trim()
  req.sanitize('term').trim()
  req.sanitize('limit').toInt()
  req.sanitize('offset').toInt()

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
