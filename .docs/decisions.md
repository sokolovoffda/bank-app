# Bank App — архитектурные решения (ADR-lite)

Зафиксированные решения для **своей** реализации. Отличия от референса — осознанные.

---

## 1. Явный `Component.tag` вместо `constructor.name`

**Контекст:** в референсе компонент ищется так:

```js
instance.constructor.name.toLowerCase() === componentName
```

**Проблема:** минификация в production переименует классы (`CardInfo` → `a`).

**Решение:**

```js
class CardInfo extends ChildComponent {
  static tag = 'card-info'
}
// <component-card-info> → CardInfo.tag
```

**Статус:** принято.

---

## 2. Store: `setState` + `notify`, без Proxy

**Контекст:** референс использует `Proxy` на state.

**Решение:** явные методы `login`, `logout`, `updateCard` + `notify()` после изменений.

**Почему:**

- проще отлаживать
- понятнее поток «кто изменил state»
- достаточно для учебного проекта

**Статус:** принято.

---

## 3. Единый контракт реактивности

**Проблема референса:** часть компонентов делает `Store.getInstance().state` один раз — не реагирует на изменения.

**Правило:**

- компонент либо **подписывается** на store в `mount` и отписывается в `destroy`
- либо родитель **перерисовывает** его при своём `render()` после изменения state

**Запрещено:** сохранять снимок `state` в constructor без подписки, если UI должен обновляться.

**Статус:** принято.

---

## 4. Lifecycle: обязательный `destroy()`

**Контекст:** референс добавляет observers, но не снимает их при смене роута.

**Решение:**

```js
destroy() {
  this.unsubscribe?.()
  // снять listeners, очистить таймеры
}
```

Router перед сменой экрана вызывает `currentScreen.destroy()`.

**Статус:** принято.

---

## 5. Router: только `[data-link]`

**Проблема референса:** перехват всех `<a>` ломает внешние ссылки.

**Решение:**

```html
<a href="/auth" data-link>Sign In</a>
<a href="https://example.com">External</a>
```

Или проверка: `new URL(href).origin === location.origin`.

**Статус:** принято.

---

## 6. DOM: минимальный `$R` или нативный API

**Варианты:**

| Вариант | Плюсы | Минусы |
|---------|-------|--------|
| Мини-`$R` | chaining, меньше boilerplate | ещё один слой для изучения |
| Нативный DOM | закрепление главы 10 | больше кода |

**Решение:** мини-`$R` с **5–8 методами**, только то что используется. Не копировать весь rquery.lib целиком.

**Статус:** на выбор при этапе 3; по умолчанию — мини-`$R`.

---

## 7. Безопасность текста

**Правило:**

- пользовательский ввод (имена, описания транзакций) → **`textContent`**
- `innerHTML` — только для **своих** статичных шаблонов из webpack

**Статус:** принято.

---

## 8. Backend: PostgreSQL + Express

**Было:** json-server / mock.

**Решение:**

- **PostgreSQL** — ты создаёшь БД и таблицы ([database.md](./database.md))
- **Express** — REST API, JWT, bcrypt ([backend.md](./backend.md))
- Фронт на `:7777`, API на `:3001`

**Почему:** полный цикл client + server + БД; ближе к production, чем mock.

**Статус:** принято (2026-08-14).

---

## 9. Сборка: Webpack 5 + Babel 7

**Не тащить:** `babel-core` v6 из референса.

**Минимум:**

- `@babel/preset-env`
- `babel-loader`
- `sass-loader`, `css-loader`, `mini-css-extract-plugin`
- `html-loader` + `html-webpack-plugin`
- `dotenv` для `SERVER_URL`

**Статус:** принято.

---

## 10. Тесты (опционально, этап 9)

**Приоритет:**

1. `Store` — login/logout/subscribe
2. format utils — currency, card number, date
3. validation — email, required fields

E2e — один сценарий login → home.

**Статус:** опционально после MVP.

---

## 11. TypeScript

**Решение:** первую версию на JS. TS — отдельный этап после MVP, если захочешь.

**Статус:** отложено.

---

## Журнал изменений решений

| Дата | Решение | Комментарий |
|------|---------|-------------|
| 2026-08-14 | PostgreSQL + Express | Вместо json-server; см. database.md, backend.md |

При новых решениях — добавлять строки в таблицу.
