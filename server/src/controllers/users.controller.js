const { pool } = require('../config/db')

async function getUsers(req, res) {
  try {
    const searchTerm = req.query.searchTerm?.trim() || ''
    const searchValue = `%${searchTerm}%`

    const result = await pool.query(
      `SELECT u.name, u.avatar_path, c.number
       FROM users u
       JOIN cards c ON c.user_id = u.id
       WHERE u.id <> $1
         AND ($2 = '%%' OR u.name ILIKE $2 OR u.email ILIKE $2)
       ORDER BY u.name ASC`,
      [req.userId, searchValue],
    )

    const users = result.rows.map((user) => ({
      name: user.name,
      avatarPath: user.avatar_path,
      card: {
        number: user.number,
      },
    }))

    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getUsers,
}
