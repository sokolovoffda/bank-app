const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const statisticsController = require('../controllers/statistics.controller')

const router = express.Router()

router.get('/', authMiddleware, statisticsController.getStatistics)

module.exports = router
