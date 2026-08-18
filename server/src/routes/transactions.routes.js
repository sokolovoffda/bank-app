const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const transactionsController = require('../controllers/transactions.controller')

const router = express.Router()

router.get('/', authMiddleware, transactionsController.getTransactions)

module.exports = router
