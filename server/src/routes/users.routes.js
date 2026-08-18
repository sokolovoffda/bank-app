const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const usersController = require('../controllers/users.controller')

const router = express.Router()

router.get('/', authMiddleware, usersController.getUsers)

module.exports = router
