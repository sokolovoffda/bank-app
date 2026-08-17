# Этап 2 — RenderService + компоненты

**Оценка:** 2–3 дня  
**Статус:** ⬜ не начат  
**Цель:** экран собирается из HTML-шаблона и вложенных компонентов, без ручного `createElement` на каждый кусок UI.

**Готово, если:** экран Auth или Home-заглушка рендерит `Button` / `Field` через `<component-*>` и `static tag`.

**Документы:** [architecture.md](../architecture.md) (RenderService), [decisions.md](../decisions.md) §1, §4, §7.

---

## Client

- [ ] База: `ChildComponent` и `BaseScreen` с `render()` и `destroy()`
- [ ] Явный `static tag = 'button'` (не `constructor.name`)
- [ ] `RenderService`: HTML-шаблон → заменить `<component-…>` на `new Component().render()`
- [ ] `innerHTML` только для **своих** шаблонов; пользовательский текст позже — `textContent`
- [ ] Стили: SCSS modules **или** BEM (выбрать одно и не смешивать)
- [ ] UI-примитивы: `Button`, `Field`
- [ ] Один экран (например Auth-заглушка) собирается из шаблона + примитивов

**Не делать:** живой login, store, http.

**Сдать:** шаблон экрана + код `RenderService` и `Button`.

---

## Server

- [ ] Не трогаем
