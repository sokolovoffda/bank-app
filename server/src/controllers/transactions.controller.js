const { pool } = require('../config/db')

async function getTransactions(req, res) {
  try {
    const orderBy = req.query.orderBy === 'asc' ? 'ASC' : 'DESC'

    const result = await pool.query(
      `SELECT id, type, amount, created_at
       FROM transactions
       WHERE user_id = $1
       ORDER BY created_at ${orderBy}`,
      [req.userId],
    )

    const transactions = result.rows.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      createdAt: transaction.created_at,
    }))

    return res.status(200).json({ transactions })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getTransactions,
}
