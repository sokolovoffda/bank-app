const { pool } = require('../config/db')

async function getStatistics(req, res) {
  try {
    const result = await pool.query(
      `SELECT
         COALESCE(SUM(CASE WHEN type IN ('TOP_UP', 'TRANSFER_IN') THEN amount ELSE 0 END), 0) AS income,
         COALESCE(SUM(CASE WHEN type IN ('WITHDRAWAL', 'TRANSFER_OUT') THEN amount ELSE 0 END), 0) AS expense
       FROM transactions
       WHERE user_id = $1`,
      [req.userId],
    )

    const row = result.rows[0]

    return res.status(200).json([
      { value: Number(row.income) },
      { value: Number(row.expense) },
    ])
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getStatistics,
}
