const express = require('express')

const router = express.Router()

/**
 * GET
 * /
 * Homepage
 */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Findstraunt' })
})

module.exports = router
