# Bank App — архитектура

Схема слоёв и потока данных для практического SPA на чистом JS.

---

## Слои приложения

```
┌─────────────────────────────────────────────────────────┐
│  UI (Screens + Components + Layout)                     │
│  — шаблоны HTML, SCSS, render(), destroy()              │
└───────────────────────────┬─────────────────────────────┘
                            │ subscribe / render
┌───────────────────────────▼─────────────────────────────┐
│  Router                                                 │
│  — URL → экран, Layout + #content                       │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Store (state)                                          │
│  — user, card, transactions; notify подписчиков         │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Services (API + side effects)                          │
│  — AuthService, CardService, Storage, Notification      │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Express API (:3001)                                    │
│  — auth, cards, transactions, JWT                       │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  PostgreSQL                                             │
│  — users, cards, transactions                           │
└─────────────────────────────────────────────────────────┘
```

**Dev-порты:** frontend `7777`, backend `3001`.

---

## Поток данных (основной паттерн)

```
Пользователь
     │
     ▼
  Событие (click, submit)
     │
     ▼
  Component / Controller
     │
     ├──► Service ──► API
     │         │
     │         ▼
     └──► Store.setState / login / logout
               │
               ▼
          store.notify()
               │
               ▼
     Подписанные компоненты → render()
               │
               ▼
            DOM обновлён
```

**Правило:** DOM не хранит «правду». Правда — в `Store` (и при необходимости в localStorage через `StorageService`).

---

## Структура папок (целевая)

```
bank-app-practice/
  client/                 # vanilla JS SPA
    src/
    webpack.config.js
    package.json
  server/                 # Express + pg (код — позже)
    src/
    package.json
  docs/                   # или learning/JS/docs/bank-app
```

---

## Router

**Ответственность:**

- слушает `popstate` и клики по `[data-link]`
- сопоставляет `pathname` с `ROUTES`
- первый раз монтирует `Layout`
- при смене экрана: `destroy()` старого screen → render нового в `#content`

**Не делает:** бизнес-логику, запросы к API.

---

## Store

**State (минимум для MVP):**

```js
{
  user: null | { id, email, name, card: { balance, number, … } },
  // опционально позже:
  // transactions: [],
  // isLoading: false,
}
```

**API store:**

- `getState()`
- `subscribe(listener)` → `unsubscribe`
- `login(user, token)` / `logout()`
- `updateCard(card)` / `addTransaction(tx)`

**Persistence:** user + token в localStorage; при старте — гидратация state.

---

## RenderService

**Ответственность:**

1. Парсит HTML-шаблон (`<template>` + `innerHTML` только для **своих** шаблонов).
2. Заменяет `<component-card-info>` на `new CardInfo().render()`.
3. Применяет SCSS module classes.

**Компонент:**

```js
class CardInfo extends ChildComponent {
  static tag = 'card-info'

  render() { /* return HTMLElement */ }
  destroy() { /* unsubscribe, remove listeners */ }
}
```

---

## Components — два уровня

| Тип | Пример | Особенности |
|-----|--------|-------------|
| **Screen** | `Home`, `Auth` | extends `BaseScreen`, меняет `document.title` |
| **Child** | `CardInfo`, `Button` | вставляется в шаблон или через `append` |

Lifecycle:

```
constructor → render() → mount() (optional)
                │
         destroy() при уходе с экрана / unmount
```

---

## Services

| Service | Роль |
|---------|------|
| `AuthService` | login/register → store + token |
| `CardService` | баланс, обновление карты |
| `TransactionService` | список, перевод |
| `StorageService` | localStorage get/set/remove |
| `NotificationService` | toast success/error |
| `ValidationService` | ошибки полей формы |
| `FormService` | сбор значений формы |

UI **не** вызывает `fetch` напрямую — только через `*Service`.

---

## HTTP Client

Обёртка над `fetch`:

- base URL: `http://localhost:3001/api/...`
- `Content-Type: application/json`
- `Authorization: Bearer …` если есть token
- единая обработка ошибок → `NotificationService`

---

## Связь с todo из главы 10

| Todo | Bank App |
|------|----------|
| `todos` + `render()` | `Store` + компоненты |
| один listener на `ul` | делегирование + router + services |
| `createElement` | `RenderService` + шаблоны |
| `hidden`, counter | store-driven UI |

Todo — одна зона state + один render.  
Bank App — те же идеи, разнесённые по слоям.

---

## Связанные документы

- [plan.md](./plan.md) — этапы реализации
- [decisions.md](./decisions.md) — архитектурные решения
- [api.md](./api.md) — HTTP-контракт
- [backend.md](./backend.md) — Express-сервер
- [database.md](./database.md) — PostgreSQL
