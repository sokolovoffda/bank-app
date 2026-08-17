# Bank App — Backend (Express + PostgreSQL)

**Статус:** зафиксировано в доках; **код сервера — позже** (напишет ментор / по этапу).

**Стек:**

- **Node.js** + **Express**
- **PostgreSQL** — базу создаёшь ты ([database.md](./database.md))
- **pg** — драйвер БД
- **bcrypt** — хэш паролей
- **jsonwebtoken** — JWT для `accessToken`
- **cors** — фронт на другом порту
- **dotenv** — конфиг

---

## Роли в проекте

| Кто | Что делает |
|-----|------------|
| **Ты** | PostgreSQL: БД, пользователь, DDL или запуск миграций |
| **Ментор / позже** | Express-приложение, роуты, SQL, auth middleware |
| **Ты (фронт)** | Webpack SPA → `fetch` на `http://localhost:3001/api` |

---

## Порты (dev)

| Сервис | Порт | URL |
|--------|------|-----|
| Frontend (Webpack) | `7777` | `http://localhost:7777` |
| Backend (Express) | `3001` | `http://localhost:3001/api` |

Фронт `.env`:

```env
SERVER_URL=http://localhost:3001
```

Запросы: `${SERVER_URL}/api/auth/login` и т.д.

---

## Структура папок (целевая)

```
bank-app-practice/
  client/                 # vanilla JS SPA (Webpack)
    src/
    webpack.config.js
    package.json
  server/                 # Express API
    src/
      index.js            # entry, listen
      app.js              # express(), middleware, routes
      config/
        env.js
        db.js             # Pool pg
      middleware/
        auth.middleware.js
        error.middleware.js
      routes/
        auth.routes.js
        cards.routes.js
        transactions.routes.js
        statistics.routes.js
        users.routes.js
      controllers/        # или services + controllers
      db/
        migrations/
        seed.sql
    package.json
  docs/                   # или ссылка на learning/JS/docs/bank-app
```

Можно monorepo с корневым `package.json` и скриптами `dev:client`, `dev:server`.

---

## Слои сервера

```
HTTP Request
     │
     ▼
  routes          — маршрут, метод
     │
     ▼
  middleware      — auth (JWT), validate body
     │
     ▼
  controller      — req/res, коды ответов
     │
     ▼
  service         — бизнес-логика (transfer, balance)
     │
     ▼
  db (pg)         — SQL к PostgreSQL
```

---

## Middleware

| Middleware | Назначение |
|------------|------------|
| `cors` | Разрешить origin фронта (`7777`) |
| `express.json()` | Парсинг JSON body |
| `authMiddleware` | Проверка `Authorization: Bearer <token>`, `req.userId` |
| `errorHandler` | Единый формат `{ message }` |

---

## Роуты (контракт = референс + [api.md](./api.md))

Префикс: `/api`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| POST | `/auth/login` | — | login → `{ user, accessToken }` |
| POST | `/auth/register` | — | register + создать card |
| GET | `/cards/by-user` | ✓ | карта текущего пользователя |
| PATCH | `/cards/balance/top-up` | ✓ | body: `{ amount }` |
| PATCH | `/cards/balance/withdrawal` | ✓ | body: `{ amount }` |
| PATCH | `/cards/transfer-money` | ✓ | body: `{ amount, fromCardNumber, toCardNumber }` |
| GET | `/transactions?orderBy=desc` | ✓ | `{ transactions: [] }` |
| GET | `/statistics` | ✓ | `[{ value }, { value }]` income/expense |
| GET | `/users?searchTerm=` | ✓ | массив пользователей (контакты) |

---

## Auth (JWT)

1. **Register / Login:** проверить email + password → bcrypt.compare / hash.
2. Выдать JWT: payload `{ userId, email }`, secret из `JWT_SECRET`, TTL например `7d`.
3. **Protected routes:** middleware декодирует token → `req.userId`.

Пароли **никогда** не отдавать в API response.

---

## Ключевая бизнес-логика

### Register

1. INSERT `users`
2. INSERT `cards` (сгенерировать number, cvc, expire_date, balance = 0 или стартовый)
3. Вернуть user (без password_hash) + token

### Transfer

В **одной транзакции БД** (`BEGIN` … `COMMIT`):

1. Найти карту отправителя (по `req.userId`) и получателя (по `toCardNumber`)
2. Проверить balance ≥ amount
3. UPDATE balances
4. INSERT две записи в `transactions`: `TRANSFER_OUT`, `TRANSFER_IN`

### Top-up / Withdrawal

1. UPDATE `cards.balance`
2. INSERT `transactions` (`TOP_UP` / `WITHDRAWAL`)

---

## Обработка ошибок

| HTTP | Когда |
|------|-------|
| 400 | невалид body, insufficient funds |
| 401 | нет / неверный token, неверный login |
| 404 | карта / user не найден |
| 409 | email уже занят |
| 500 | необработанная ошибка БД |

Формат:

```json
{ "message": "Insufficient funds" }
```

---

## Зависимости server (ориентир)

```json
{
  "dependencies": {
    "bcrypt": "^5.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "express": "^4.x",
    "jsonwebtoken": "^9.x",
    "pg": "^8.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}
```

Опционально позже: `zod` / `express-validator` для валидации body.

---

## Скрипты (ориентир)

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "db:migrate": "node src/db/migrate.js",
    "db:seed": "node src/db/seed.js"
  }
}
```

---

## Этап реализации backend (в плане)

Отдельный блок **до или параллельно** фронту (этап 5):

1. [ ] PostgreSQL: БД создана, таблицы ([database.md](./database.md))
2. [ ] Express: каркас, cors, json, health `GET /api/health`
3. [ ] Подключение `pg` Pool
4. [ ] Auth: register, login, JWT middleware
5. [ ] Cards: by-user, balance, transfer
6. [ ] Transactions list, statistics, users search
7. [ ] Seed для dev
8. [ ] Фронт подключается к реальному API

**Готово, если:** Postman / curl — login, GET card с Bearer token, transfer меняет balance в БД.

---

## CORS (dev)

```js
cors({
  origin: 'http://localhost:7777',
  credentials: false,
})
```

---

## Связанные документы

- [database.md](./database.md) — DDL, таблицы
- [api.md](./api.md) — контракт для фронта
- [plan.md](./plan.md) — общий план проекта
- [decisions.md](./decisions.md) — решение PostgreSQL + Express
