const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { pool } = require('../config/db')
const env = require('../config/env')

const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function buildAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: '7d' },
  )
}

function buildUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarPath: user.avatar_path,
  }
}

function generateCardNumber() {
  let cardNumber = ''

  while (cardNumber.length < 16) {
    cardNumber += crypto.randomInt(0, 10).toString()
  }

  return cardNumber
}

function generateCvc() {
  return crypto.randomInt(100, 1000).toString()
}

function generateExpireDate() {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 3)

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)

  return `${month}/${year}`
}

async function createUniqueCard(client, userId) {
  while (true) {
    const number = generateCardNumber()
    const cvc = generateCvc()
    const expireDate = generateExpireDate()

    try {
      const result = await client.query(
        `INSERT INTO cards (user_id, number, balance, cvc, expire_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, number, balance, cvc, expire_date`,
        [userId, number, 0, cvc, expireDate],
      )

      return result.rows[0]
    } catch (error) {
      if (error.code !== '23505') {
        throw error
      }
    }
  }
}

async function register(req, res) {
  const client = await pool.connect()

  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (!passReg.test(password) || !emailReg.test(email)) {
      return res.status(400).json({ message: 'Invalid request body' })
    }

    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await client.query('BEGIN')

    const result = await client.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, avatar_path`,
      [email, passwordHash, name],
    )

    const user = result.rows[0]

    if (!user) {
      await client.query('ROLLBACK')
      return res.status(500).json({ message: 'Failed to create user' })
    }

    await createUniqueCard(client, user.id)

    await client.query('COMMIT')

    const accessToken = buildAccessToken(user)

    return res.status(201).json({
      user: buildUserResponse(user),
      accessToken,
    })
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch {
      // Ignore rollback errors if transaction was not started.
    }

    return res.status(500).json({ message: error.message })
  } finally {
    client.release()
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const result = await pool.query(
      `SELECT id, email, password_hash, name, avatar_path
       FROM users
       WHERE email = $1`,
      [email],
    )

    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const accessToken = buildAccessToken(user)

    return res.status(200).json({
      user: buildUserResponse(user),
      accessToken,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  register,
  login,
}
