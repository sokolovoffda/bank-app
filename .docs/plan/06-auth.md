# Этап 6 — Auth screen

**Оценка:** 1–2 дня  
**Статус:** ⬜ не начат  
**Цель:** полный цикл login / register без перезагрузки страницы.

**Готово, если:** регистрация и вход работают через API; после login виден user в header; logout чистит store и storage.

---

## Client

- [ ] Экран Auth: форма login / register (toggle)
- [ ] Валидация: пустые поля, формат email (до запроса)
- [ ] `NotificationService`: toast success / error
- [ ] Header: имя/email пользователя + logout после login
- [ ] Неавторизованный пользователь на `/` → редирект на `/auth` (или наоборот: с `/auth` после login на `/`)
- [ ] Пользовательский ввод в DOM — только `textContent`

**Не делать:** карточку, переводы, статистику.

**Сдать:** сценарий register → logout → login → header обновлён.

---

## Server

- [ ] Проверить register (создание user + card) и login по контракту
- [ ] Сообщения ошибок понятны фронту (`Invalid email or password`, `User already exists`)
- [ ] Правки только если контракт [api.md](../api.md) реально дырявый — тогда обновить и api.md
