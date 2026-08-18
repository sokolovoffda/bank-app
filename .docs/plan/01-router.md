# Этап 1 — Router

**Оценка:** 1–2 дня  
**Статус:** ⬜ не начат  
**Цель:** смена URL без перезагрузки страницы, контент зависит от path.

**Готово, если:** клики по меню меняют URL и `#content` без reload; неизвестный path → 404; F5 на `/auth` не ломает dev-server (`historyApiFallback` с этапа 0).

**Фокус:** делегирование, layout vs screen, ещё без настоящего `destroy()` (заготовка ок).

---

## Client

- [x] `routes.data.js`: `/`, `/auth`, `/about-us`, fallback 404
- [x] `Router`: `pushState` + слушатель `popstate`
- [x] Layout монтируется **один раз**; внутри контейнер `#content`
- [x] Перехват кликов **только** по `a[data-link]` (не все `<a>`)
- [x] Заглушки экранов: текст «Home», «Auth», «About», «Not found»
- [x] Меню в layout с `data-link` на существующие роуты

**Не делать:** RenderService, Store, API, настоящие формы.

**Сдать:** клик Home → Auth → неизвестный URL; Back/Forward браузера.

---

## Server

- [x] Не трогаем (этап 0b можно вести параллельно, но роутер от API не зависит)

Если 0b ещё не начат — так и оставляем.
