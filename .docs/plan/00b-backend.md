# Этап 0b — Backend (Express + PostgreSQL)

**Оценка:** 3–5 дней  
**Статус:** ⬜ не начат  
**Старт:** после того как БД `bank_app` из этапа 0 готова.  
**Код сервера:** по [backend.md](../backend.md); можно писать вместе с ментором.

**Готово, если:** curl/Postman — login, `GET /api/cards/by-user` с Bearer token, transfer меняет `balance` в PostgreSQL.

**Документы:** [backend.md](../backend.md), [api.md](../api.md), [database.md](../database.md).

Можно вести **параллельно** с этапами 1–4 на клиенте.

---

## Client

На этом этапе фронт не пишем.

- [x] Убедиться, что `.env` по-прежнему `SERVER_URL=http://localhost:3001`
- [x] Не подключать `fetch` — это этап 5

**Не делать:** Auth screen, httpClient, сервисы.

---



## Server

- [x] Зависимости: `express`, `pg`, `cors`, `dotenv`, `bcrypt`, `jsonwebtoken`, `nodemon`
- [x] Каркас: `src/index.js`, `src/app.js`, `express.json()`, cors на `http://localhost:7777`
- [x] `GET /api/health` → `{ status: "ok", db: "connected" }`
- [x] `pg` Pool из `.env` (`DATABASE_URL` или host/user/password/db)
- [x] Миграции / запуск [schema.sql](../schema.sql)
- [x] Seed для dev ([seed.sql](../seed.sql))
- [x] Auth: `POST /api/auth/register`, `POST /api/auth/login`, JWT
- [x] Auth middleware: `Authorization: Bearer …` → `req.userId`
- [x] Cards: `GET /by-user`, top-up, withdrawal, transfer (одна транзакция БД)
- [x] `GET /api/transactions`, `GET /api/statistics`, `GET /api/users`
- [ ] Единый error handler: `{ message }` + коды 400/401/404/409/500
- [x] Пароли и `password_hash` не отдавать в JSON

**Не делать:** UI, копировать json-server.

**Сдать:** примеры curl (health, register, login, card, transfer) и что баланс в БД изменился.