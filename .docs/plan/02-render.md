# Этап 2 — RenderService + компоненты

**Оценка:** 2–3 дня  
**Статус:** 🟡 почти готов  
**Цель:** экран собирается из HTML-шаблона и вложенных компонентов, без ручного `createElement` на каждый кусок UI.

**Готово, если:** экран Auth или Home-заглушка рендерит `Button` / `Field` через `<component-*>` и `static tag`.

**Документы:** [architecture.md](../architecture.md) (RenderService), [decisions.md](../decisions.md) §1, §4, §7.

---

## Client

- [x] База: `ChildComponent` и `BaseScreen` с `render()` и `destroy()`
- [x] Явный `static tag = 'button'` (не `constructor.name`)
- [x] `RenderService`: HTML-шаблон → заменить `<component-…>` на `new Component().render()`
- [x] `innerHTML` только для **своих** шаблонов; пользовательский текст позже — `textContent`
- [x] Стили: **BEM** + токены референса ([styles.md](../styles.md); CSS Modules не используем)
- [x] UI-примитивы: `Button`, `Field`
- [x] Один экран (например Auth-заглушка) собирается из шаблона + примитивов

**Не делать:** живой login, store, http.

**Сдать:** шаблон экрана + код `RenderService` и `Button`.

---

## Server

- [ ] Не трогаем
