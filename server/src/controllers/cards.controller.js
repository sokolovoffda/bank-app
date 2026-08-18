const { pool } = require('../config/db')

function mapCardResponse(card) {
  return {
    id: card.id,
    number: card.number,
    balance: Number(card.balance),
    cvc: card.cvc,
    expireDate: card.expire_date,
  }
}

function parseAmount(value) {
  const amount = Number(value)

  if (!Number.isFinite(amount) || amount <= 0) {
    return null
  }

  return amount
}

async function getCurrentCard(client, userId) {
  const result = await client.query(
    `SELECT id, user_id, number, balance, cvc, expire_date
     FROM cards
     WHERE user_id = $1`,
    [userId],
  )

  return result.rows[0]
}

async function getCardByUser(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, number, balance, cvc, expire_date
       FROM cards
       WHERE user_id = $1`,
      [req.userId],
    )

    const card = result.rows[0]

    if (!card) {
      return res.status(404).json({ message: 'Card not found' })
    }

    return res.status(200).json(mapCardResponse(card))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

async function topUp(req, res) {
  const client = await pool.connect()

  try {
    const amount = parseAmount(req.body.amount)

    if (!amount) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    await client.query('BEGIN')

    const currentCard = await getCurrentCard(client, req.userId)

    if (!currentCard) {
      await client.query('ROLLBACK')
      return res.status(404).json({ message: 'Card not found' })
    }

    const updatedCardResult = await client.query(
      `UPDATE cards
       SET balance = balance + $1
       WHERE user_id = $2
       RETURNING id, number, balance, cvc, expire_date`,
      [amount, req.userId],
    )

    await client.query(
      `INSERT INTO transactions (user_id, card_id, type, amount)
       VALUES ($1, $2, 'TOP_UP', $3)`,
      [req.userId, currentCard.id, amount],
    )

    await client.query('COMMIT')

    return res.status(200).json(mapCardResponse(updatedCardResult.rows[0]))
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch {}

    return res.status(500).json({ message: error.message })
  } finally {
    client.release()
  }
}

async function withdrawal(req, res) {
  const client = await pool.connect()

  try {
    const amount = parseAmount(req.body.amount)

    if (!amount) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    await client.query('BEGIN')

    const currentCard = await getCurrentCard(client, req.userId)

    if (!currentCard) {
      await client.query('ROLLBACK')
      return res.status(404).json({ message: 'Card not found' })
    }

    if (Number(currentCard.balance) < amount) {
      await client.query('ROLLBACK')
      return res.status(400).json({ message: 'Insufficient funds' })
    }

    const updatedCardResult = await client.query(
      `UPDATE cards
       SET balance = balance - $1
       WHERE user_id = $2
       RETURNING id, number, balance, cvc, expire_date`,
      [amount, req.userId],
    )

    await client.query(
      `INSERT INTO transactions (user_id, card_id, type, amount)
       VALUES ($1, $2, 'WITHDRAWAL', $3)`,
      [req.userId, currentCard.id, amount],
    )

    await client.query('COMMIT')

    return res.status(200).json(mapCardResponse(updatedCardResult.rows[0]))
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch {}

    return res.status(500).json({ message: error.message })
  } finally {
    client.release()
  }
}

async function transferMoney(req, res) {
  const client = await pool.connect()

  try {
    const amount = parseAmount(req.body.amount)
    const { fromCardNumber, toCardNumber } = req.body

    if (!amount || !fromCardNumber || !toCardNumber) {
      return res.status(400).json({ message: 'Invalid request body' })
    }

    if (fromCardNumber === toCardNumber) {
      return res.status(400).json({ message: 'Cards must be different' })
    }

    await client.query('BEGIN')

    const senderResult = await client.query(
      `SELECT id, user_id, number, balance
       FROM cards
       WHERE user_id = $1 AND number = $2
       FOR UPDATE`,
      [req.userId, fromCardNumber],
    )

    const receiverResult = await client.query(
      `SELECT id, user_id, number, balance
       FROM cards
       WHERE number = $1
       FOR UPDATE`,
      [toCardNumber],
    )

    const senderCard = senderResult.rows[0]
    const receiverCard = receiverResult.rows[0]

    if (!senderCard || !receiverCard) {
      await client.query('ROLLBACK')
      return res.status(404).json({ message: 'Card not found' })
    }

    if (Number(senderCard.balance) < amount) {
      await client.query('ROLLBACK')
      return res.status(400).json({ message: 'Insufficient funds' })
    }

    await client.query(
      'UPDATE cards SET balance = balance - $1 WHERE id = $2',
      [amount, senderCard.id],
    )

    await client.query(
      'UPDATE cards SET balance = balance + $1 WHERE id = $2',
      [amount, receiverCard.id],
    )

    await client.query(
      `INSERT INTO transactions (user_id, card_id, type, amount)
       VALUES ($1, $2, 'TRANSFER_OUT', $3)`,
      [req.userId, senderCard.id, amount],
    )

    await client.query(
      `INSERT INTO transactions (user_id, card_id, type, amount)
       VALUES ($1, $2, 'TRANSFER_IN', $3)`,
      [receiverCard.user_id, receiverCard.id, amount],
    )

    await client.query('COMMIT')

    return res.status(200).json({ message: 'OK' })
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch {}

    return res.status(500).json({ message: error.message })
  } finally {
    client.release()
  }
}

module.exports = {
  getCardByUser,
  topUp,
  withdrawal,
  transferMoney,
}
