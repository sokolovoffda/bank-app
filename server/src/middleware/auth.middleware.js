const jwt = require('jsonwebtoken')
const env = require('../config/env')
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, env.jwtSecret)
    req.userId = payload.userId
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}
module.exports = authMiddleware