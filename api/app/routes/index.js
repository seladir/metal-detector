const router = require('express').Router()
const asyncHandler = require('../lib/asyncHandler')
const detectFile = require('./detectFile')
const detectLink = require('./detectLink')
const detectGet = require('./detectGet')

router.post('/detect-file', asyncHandler(detectFile))
router.post('/detect-link', asyncHandler(detectLink))
router.get('/detect/:id', asyncHandler(detectGet))

module.exports = router
