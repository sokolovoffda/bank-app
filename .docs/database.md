# Bank App — PostgreSQL (схема данных)

Ты создаёшь базу в PostgreSQL; сервер на Express будет работать с этими таблицами.  
SQL-миграции и seed — на этапе backend (см. [backend.md](./backend.md)).

**СУБД:** PostgreSQL 14+  
**Кодировка:** UTF-8

---

## ER-диаграмма (логическая)

```
users ──────< cards
  │              │
  │              │
  └──────< transactions
```

- У пользователя **одна** карта (MVP).
- Транзакции привязаны к пользователю и карте.

---

## Таблица `users`

| Колонка | Тип | Ограничения |
|---------|-----|-------------|
| `id` | `SERIAL` / `BIGSERIAL` | PRIMARY KEY |
| `email` | `VARCHAR(255)` | UNIQUE, NOT NULL |
| `password_hash` | `VARCHAR(255)` | NOT NULL |
| `name` | `VARCHAR(120)` | NOT NULL |
| `avatar_path` | `TEXT` | NULL |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` |

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(120) NOT NULL,
  avatar_path   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Таблица `cards`

| Колонка | Тип | Ограничения |
|---------|-----|-------------|
| `id` | `SERIAL` | PRIMARY KEY |
| `user_id` | `INTEGER` | NOT NULL, UNIQUE, FK → `users(id)` ON DELETE CASCADE |
| `number` | `CHAR(16)` | NOT NULL, UNIQUE |
| `balance` | `NUMERIC(12, 2)` | NOT NULL, DEFAULT 0 |
| `cvc` | `CHAR(3)` | NOT NULL |
| `expire_date` | `VARCHAR(7)` | NOT NULL — формат `MM/YY` для UI |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` |

```sql
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
```

---

## Таблица `transactions`

| Колонка | Тип | Ограничения |
|---------|-----|-------------|
| `id` | `SERIAL` | PRIMARY KEY |
| `user_id` | `INTEGER` | NOT NULL, FK → `users(id)` |
| `card_id` | `INTEGER` | NOT NULL, FK → `cards(id)` |
| `type` | `VARCHAR(20)` | NOT NULL — см. enum ниже |
| `amount` | `NUMERIC(12, 2)` | NOT NULL, CHECK (`amount` > 0) |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT `NOW()` |

**Типы транзакций (MVP):**

| `type` | Смысл | Влияние на balance |
|--------|-------|---------------------|
| `TOP_UP` | Пополнение | + |
| `WITHDRAWAL` | Снятие | − |
| `TRANSFER_OUT` | Перевод другому | − |
| `TRANSFER_IN` | Входящий перевод | + |

```sql
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
```

---

## Statistics

Отдельная таблица **не нужна** — агрегаты считаются SQL-запросом по `transactions`:

- **Income:** сумма `TOP_UP` + `TRANSFER_IN`
- **Expense:** сумма `WITHDRAWAL` + `TRANSFER_OUT`

---

## Что создать вручную (твоя часть)

1. База данных, например: `bank_app`
2. Пользователь PostgreSQL с правами на эту БД
3. Выполнить DDL: [schema.sql](./schema.sql)
4. Наполнить данными: [seed.sql](./seed.sql)
5. Бэкап: [backups/README.md](./backups/README.md) (`pg_dump`, не bcp)

**Пример (psql):**

```sql
CREATE DATABASE bank_app;
-- подключиться к bank_app и выполнить CREATE TABLE ...
```

---

## Seed-данные (минимум для dev)

После миграций — тестовый пользователь (пароль хэширует сервер при register; для seed — bcrypt-хэш):

| email | password (plain, dev) | name |
|-------|----------------------|------|
| `user@example.com` | `secret123` | Dmitriy |

Карта:

| number | balance | cvc | expire_date |
|--------|---------|-----|-------------|
| `4111111111111111` | `12500.50` | `123` | `12/28` |

2–3 транзакции разных типов для проверки списка и statistics.

> Конкретный seed SQL / скрипт добавит Express-проект на этап backend.

---

## Переменные окружения (для сервера)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bank_app
# или по отдельности:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bank_app
DB_USER=bank_user
DB_PASSWORD=...
```

---

## Связанные документы

- [backend.md](./backend.md) — Express-сервер (план реализации)
- [api.md](./api.md) — HTTP-контракт для фронта
- [architecture.md](./architecture.md) — общая схема
