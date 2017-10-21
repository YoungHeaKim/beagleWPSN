const query = require('../mainquery')
const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.post('/', (req, res) => {})

router.get('/', (req, res, next) => {})

module.exports = router
