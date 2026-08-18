const { Pool } = require('pg')
const env = require('./env')

const pool = new Pool(env.db)

async function checkDbConnection() {
  const client = await pool.connect()

  try {
    await client.query('SELECT 1')
  } finally {
    client.release()
  }
}

module.exports = {
  pool,
  checkDbConnection,
}
