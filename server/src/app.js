const express = require('express')
const cors = require('cors')
const env = require('./config/env')
const { checkDbConnection } = require('./config/db')
const authRoutes = require('./routes/auth.routes')
const cardsRoutes = require('./routes/cards.routes')
const transactionsRoutes = require('./routes/transactions.routes')
const statisticsRoutes = require('./routes/statistics.routes')
const usersRoutes = require('./routes/users.routes')

const app = express()

app.use(
  cors({
    origin: env.clientUrl,
  }),
)

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/cards', cardsRoutes)
app.use('/api/transactions', transactionsRoutes)
app.use('/api/statistics', statisticsRoutes)
app.use('/api/users', usersRoutes)

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
