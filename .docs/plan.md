# Bank App — план реализации

Переписать **с нуля по мотивам** учебного SPA «банк» на чистом JS.
Не копировать референс `my-bank-app` — воспроизвести архитектуру и закрыть слабые места ([decisions.md](./decisions.md)).

**Формат:** один этап → код / вопросы → ревью → галочки в чеклисте этапа.

**Корень проекта:** `01 JS/bank-app/` (`client/`, `server/`, `.docs/`).

---

## Как читать планы

У каждого этапа свой файл. Внутри всегда два блока:

| Блок | Что там |
|------|---------|
| **Client** | Webpack SPA (`client/`) |
| **Server** | Express + PostgreSQL (`server/`) |

Если слой на этапе не трогаем — так и написано, чтобы не прыгать вперёд.

---

## Порядок (не перескакивать)

```
Этап 0 (каркас) → 0b (API) параллельно с 1–4 → 5 (http) только когда login живой → Auth → Home
```

Backend можно вести **параллельно** с Router / Store. Auth на фронте — только когда `POST /api/auth/login` работает.

---

## Прогресс

| Этап | Файл | Client | Server | Статус |
|------|------|--------|--------|--------|
| 0 — Каркас | [00-scaffold.md](./plan/00-scaffold.md) | Webpack + заглушка | папка-маркер + БД | ⬜ в работе |
| 0b — Backend | [00b-backend.md](./plan/00b-backend.md) | не трогаем | Express + JWT + API | ⬜ |
| 1 — Router | [01-router.md](./plan/01-router.md) | роутер, layout, заглушки экранов | не трогаем | ⬜ |
| 2 — RenderService | [02-render.md](./plan/02-render.md) | компоненты, шаблоны, Button/Field | не трогаем | ⬜ |
| 3 — DOM-слой | [03-dom.md](./plan/03-dom.md) | мини-`$R` | не трогаем | ⬜ |
| 4 — Store | [04-store.md](./plan/04-store.md) | store + localStorage | не трогаем | ⬜ |
| 5 — HTTP Client | [05-http.md](./plan/05-http.md) | httpClient + services | API уже готов | ⬜ |
| 6 — Auth | [06-auth.md](./plan/06-auth.md) | login/register, toast, header | правки API по ревью | ⬜ |
| 7 — Home | [07-home.md](./plan/07-home.md) | карта, tx, transfer | те же эндпоинты | ⬜ |
| 8 — Полировка | [08-polish.md](./plan/08-polish.md) | destroy, title, README, build | README, скрипты | ⬜ |
| 9 — Тесты | [09-tests.md](./plan/09-tests.md) | Vitest, e2e | опционально | ⬜ опционально |

---

## MVP vs полная версия

**MVP:** PostgreSQL, Express (auth + card + transactions), фронт: router, store, auth, home (карта + список транзакций).

**Полная версия:** statistics, transfer, contacts, about-us, тесты, deploy.

---

## Связанные документы

- [architecture.md](./architecture.md)
- [decisions.md](./decisions.md)
- [api.md](./api.md)
- [backend.md](./backend.md)
- [database.md](./database.md)
