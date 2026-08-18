const app = require('./app')
const env = require('./config/env')
const { checkDbConnection } = require('./config/db')

async function start() {
  try {
    await checkDbConnection()

    app.listen(env.port, () => {
      console.log(`Server started on http://localhost:${env.port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

start()
