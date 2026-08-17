-- Bank App — seed (тестовые данные)
-- Выполнять ПОСЛЕ schema.sql, подключившись к bank_app.
--
-- Тестовые пароли (dev): secret123
-- Login: user@example.com / secret123
--        anna@example.com / secret123

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

TRUNCATE TABLE transactions, cards, users RESTART IDENTITY CASCADE;

-- Пользователь 1
INSERT INTO users (email, password_hash, name, avatar_path)
VALUES (
  'user@example.com',
  crypt('secret123', gen_salt('bf', 10)),
  'Dmitriy',
  'https://i.pravatar.cc/150?u=dmitriy'
);

INSERT INTO cards (user_id, number, balance, cvc, expire_date)
SELECT id, '4111111111111111', 12500.50, '123', '12/28'
FROM users WHERE email = 'user@example.com';

-- Пользователь 2 (для переводов / контактов)
INSERT INTO users (email, password_hash, name, avatar_path)
VALUES (
  'anna@example.com',
  crypt('secret123', gen_salt('bf', 10)),
  'Anna',
  'https://i.pravatar.cc/150?u=anna'
);

INSERT INTO cards (user_id, number, balance, cvc, expire_date)
SELECT id, '5555555555554444', 8000.00, '456', '06/27'
FROM users WHERE email = 'anna@example.com';

-- Транзакции Dmitriy
INSERT INTO transactions (user_id, card_id, type, amount, created_at)
SELECT u.id, c.id, 'TOP_UP', 50000.00, NOW() - INTERVAL '30 days'
FROM users u
JOIN cards c ON c.user_id = u.id
WHERE u.email = 'user@example.com';

INSERT INTO transactions (user_id, card_id, type, amount, created_at)
SELECT u.id, c.id, 'WITHDRAWAL', 1500.00, NOW() - INTERVAL '10 days'
FROM users u
JOIN cards c ON c.user_id = u.id
WHERE u.email = 'user@example.com';

INSERT INTO transactions (user_id, card_id, type, amount, created_at)
SELECT u.id, c.id, 'TOP_UP', 5000.00, NOW() - INTERVAL '3 days'
FROM users u
JOIN cards c ON c.user_id = u.id
WHERE u.email = 'user@example.com';

INSERT INTO transactions (user_id, card_id, type, amount, created_at)
SELECT u.id, c.id, 'TRANSFER_OUT', 500.00, NOW() - INTERVAL '1 day'
FROM users u
JOIN cards c ON c.user_id = u.id
WHERE u.email = 'user@example.com';

-- Входящий перевод Anna
INSERT INTO transactions (user_id, card_id, type, amount, created_at)
SELECT u.id, c.id, 'TRANSFER_IN', 500.00, NOW() - INTERVAL '1 day'
FROM users u
JOIN cards c ON c.user_id = u.id
WHERE u.email = 'anna@example.com';

COMMIT;

-- Проверка:
-- SELECT u.email, u.name, c.number, c.balance FROM users u JOIN cards c ON c.user_id = u.id;
-- SELECT type, amount, created_at FROM transactions ORDER BY created_at DESC;
