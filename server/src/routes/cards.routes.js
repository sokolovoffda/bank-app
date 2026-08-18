const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const cardsController = require('../controllers/cards.controller')

const router = express.Router()

router.get('/by-user', authMiddleware, cardsController.getCardByUser)
router.patch('/balance/top-up', authMiddleware, cardsController.topUp)
router.patch('/balance/withdrawal', authMiddleware, cardsController.withdrawal)
router.patch('/transfer-money', authMiddleware, cardsController.transferMoney)

module.exports = router
