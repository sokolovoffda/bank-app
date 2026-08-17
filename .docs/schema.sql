-- Bank App — PostgreSQL schema
-- 1) Создай БД (от суперпользователя postgres), если ещё нет:
--    CREATE DATABASE bank_app ENCODING 'UTF8';
-- 2) Подключись к bank_app и выполни этот файл целиком.

BEGIN;

-- Пересоздание (осторожно: удалит все данные)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(120) NOT NULL,
  avatar_path   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cards (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  number       CHAR(16) NOT NULL UNIQUE,
  balance      NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  cvc          CHAR(3) NOT NULL,
  expire_date  VARCHAR(7) NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_number ON cards(number);

CREATE TABLE transactions (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id     INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  type        VARCHAR(20) NOT NULL CHECK (type IN (
                'TOP_UP', 'WITHDRAWAL', 'TRANSFER_OUT', 'TRANSFER_IN'
              )),
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

COMMIT;

-- Проверка:
-- \dt
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
