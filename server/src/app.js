const express = require('express')
const cors = require('cors')
const env = require('./config/env')
const { checkDbConnection } = require('./config/db')

const app = express()

app.use(
  cors({
    origin: env.clientUrl,
  }),
)

app.use(express.json())

app.get('/api/health', async (req, res) => {
  try {
    await checkDbConnection()

    res.json({
      status: 'ok',
      db: 'connected',
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      db: 'disconnected',
      message: error.message,
    })
  }
})

module.exports = app
