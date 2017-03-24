const express = require('express')
const yelp = require('yelp-fusion')

const router = express.Router()

/**
 * POST
 * /recommendations
 * API Endpoint for general recommendations
 *
 * Parameters:
 *  required:
 *    term: Search term
 *    location: Location
 *  optional:
 *    limit: How many to show
 *    offset: Offset the list of returned business results by this amount.
 */
router.post('/recommendations', (req, res, next) => {
  // Search
  req.yelpClient.search({
    term: req.body.term,
    location: req.body.location,
  }).then((response) => {
    console.log(response.jsonBody.businesses)
    res.status(200).json({
      term: req.body.term,
      location: req.body.location,
      response: response.jsonBody.businesses,
    })
  }).catch((err) => {
    console.error(err)
    res.status(406).json({ error: err })
  })
})

module.exports = router
