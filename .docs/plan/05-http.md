# Этап 5 — HTTP Client + Services

**Оценка:** 1 день  
**Статус:** ⬜ не начат  
**Зависимость:** этап **0b готов** хотя бы для auth + card. Без живого API этот этап не начинаем.

**Готово, если:** `POST /api/auth/login` с фронта кладёт user/token в store и можно уйти на `/` (редирект можно черновой).

**Документы:** [api.md](../api.md).

---

## Client

- [ ] `httpClient`: base URL из `SERVER_URL`, JSON, Bearer token из storage
- [ ] Ошибки: `throw` с `message` с сервера; уведомления — на этапе 6, здесь достаточно `console` / заготовки
- [ ] `AuthService`: login, register
- [ ] `CardService`: by-user (и заготовки top-up / transfer)
- [ ] `TransactionService`: список
- [ ] UI **не** вызывает `fetch` напрямую — только сервисы
- [ ] После успешного login: `store.login(user, token)`

**Не делать:** полноценный Auth UI (этап 6) и Home (этап 7). Допустима временная кнопка «login test».

**Сдать:** `httpClient` + `AuthService`, пример успешного login в Network.

---

## Server

- [ ] API этапа 0b отвечает с фронта `:7777` (CORS уже должен быть)
- [ ] По багам с клиента — править контракт, не «подгонять» фронт в обход [api.md](../api.md)

Если 0b не готов — **стоп**, возвращаемся к серверу.
