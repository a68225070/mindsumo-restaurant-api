const util = require('util')
const express = require('express')
const yelp = require('yelp-fusion')

const router = express.Router()

/**
 * POST
 * /search
 * API Endpoint for general search
 *
 * Parameters:
 *  required:
 *    term: Search term
 *    location: Location
 *  optional:
 *    limit: How many to show
 *    offset: Offset the list of returned business results by this amount.
 */
router.post('/search', (req, res, next) => {
  // Validate inputs
  req.assert('term', '"term" cannot be empty.').notEmpty()
  req.assert('location', '"location" cannot be empty.').notEmpty()
  req.assert('limit', '"limit" must be a number.').optional().isInt()
  req.assert('offset', '"offset" must be a number.').optional().isInt()
  // Sanitize inputs
  req.sanitize('term').trim()
  req.sanitize('location').trim()
  req.sanitize('limit').toInt()
  req.sanitize('offset').toInt()

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      res.status(400).json({ status: 400, error: result.array() })
      return
    }
    // Search
    const searchObject = {
      term: req.body.term,
      location: req.body.location,
    }

    if (req.body.limit) searchObject.limit = req.body.limit
    if (req.body.offset) searchObject.offset = req.body.offset

    req.yelpClient.search(searchObject).then((response) => {
      res.status(200).json({
        term: req.body.term,
        location: req.body.location,
        response: response.jsonBody.businesses,
      })
    }).catch((err) => {
      console.error(err)
      res.status(406).json({ status: 406, error: err })
    })
  })
})

module.exports = router
