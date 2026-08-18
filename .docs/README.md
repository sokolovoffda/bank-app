# Bank App — практический проект

План переписывания SPA «банк» на чистом JS **с нуля** + **Express + PostgreSQL**.

**Статус:** документация готова; код — по этапам в [plan/](./plan/).

---

## Стек

| Слой | Технология |
|------|------------|
| Frontend | Vanilla JS, Webpack, SCSS |
| Backend | Express, JWT, bcrypt |
| Database | **PostgreSQL** (базу создаёшь ты) |

**Dev:** frontend `:7777`, API `:3001`

---

## Документы

| Файл | Описание |
|------|----------|
| [plan.md](./plan.md) | Оглавление этапов и прогресс |
| [plan/](./plan/) | Чеклисты этапа: отдельно **Client** и **Server** |
| [architecture.md](./architecture.md) | Слои, поток данных, структура папок |
| [decisions.md](./decisions.md) | Архитектурные решения |
| [styles.md](./styles.md) | Токены, BEM, как писать SCSS |
| [database.md](./database.md) | **PostgreSQL** — таблицы, DDL, seed |
| [backend.md](./backend.md) | **Express** — план сервера (код позже) |
| [api.md](./api.md) | HTTP-контракт frontend ↔ backend |
| [schema.sql](./schema.sql) | DDL — создание таблиц |
| [seed.sql](./seed.sql) | Тестовые данные |
| [backups/](./backups/) | Инструкция pg_dump + место для дампов |

---

## Роли

| Кто | Задача |
|-----|--------|
| **Ты** | PostgreSQL: БД, пользователь, DDL |
| **Ты** | Frontend по [plan.md](./plan.md) |
| **Ментор / позже** | Код Express-сервера по [backend.md](./backend.md) |

---

## С чего начать (когда будешь готов)

1. [plan/00-scaffold.md](./plan/00-scaffold.md) — каркас `client/` + `server/` + БД
2. [plan/00b-backend.md](./plan/00b-backend.md) — Express (можно параллельно с Router)
3. Дальше по [plan.md](./plan.md): Router → … → Auth → Home

---

## Связь с учебными материалами

- [../pattern.md](../pattern.md) — теория больших vanilla SPA
- [../dom-api-cheatsheet.md](../dom-api-cheatsheet.md) — DOM на практике
- [../classes.md](../classes.md) — компоненты и lifecycle
