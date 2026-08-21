# Практика: от `678affb` до состояния `main` (Router → Render → Button)

**Ветка:** `practice/from-678affb-replay`  
**Старт:** коммит `678affb` (`prettier`)  
**Цель повторить:** изменения, которые сейчас на `main` (до `f611080`) — без копипаста с `main`, своими руками.

**Эталон для сверки (не подглядывать код сразу):** `git show main:path/to/file` или diff `678affb..main`.

**Связанные планы:** [01-router.md](./plan/01-router.md), [02-render.md](./plan/02-render.md), [styles.md](./styles.md), [decisions.md](./decisions.md) §1, §4, §5, §7, §12.

---

## Что уже есть на старте (`678affb`)

| Есть | Нет / недоделано |
|------|------------------|
| Webpack, `client/`, layout, `routes.data`, экраны-заглушки | В `Router` только монтируется layout — нет кликов / `popstate` / смены `#content` |
| Alias `@` в webpack | В JS всё ещё относительные `require('../…')` |
| `html-loader`, prettier в `package.json` | Нет `.prettierrc`, `jsconfig`, `esModule: false` у html-loader |
| Пустой/минимальный `main.scss` | Нет токенов BEM, BaseScreen, ChildComponent, RenderService, Button |

Экраны возвращают **строки HTML**. Роутер пока не рисует маршруты.

---

## Критерий «готово» (как на `main` по смыслу)

1. Клики по `a[data-link]` и кнопка «Назад» меняют экран в `#content`.
2. Есть `BaseScreen` / `ChildComponent`, `RenderService` с заменой `<component-*>`.
3. `Button` с `static tag = 'button'`, шаблон `.html`, текст через `textContent`.
4. Home собирает DOM через `htmlToElement(…, [new Button({…})])`, роутер делает `replaceChildren`.
5. В JS везде алиасы `@/…` (кроме `webpack.config.js` и соседних `./button.template.html`).
6. Prettier + `jsconfig` paths; html-loader отдаёт **строку**.

**Не входит в этот прогон:** Field, живой Auth, store, http, CSS Modules.

---

## Шаг 0 — Окружение

- [ ] `cd client && npm install && npm run dev` (`:7777`)
- [ ] Открыть `/` — пока только layout (роуты ещё не работают) — это нормально

---

## Шаг 1 — Дописать Router (этап 1)

Файлы: `client/src/router/router.js`, при необходимости layout / экраны.

- [ ] После монтирования layout слушать клики: только `a[data-link]`, `preventDefault`, `history.pushState`, вызвать приватный `#renderRoute(path)`
- [ ] Слушать `popstate` → `#renderRoute(location.pathname)`
- [ ] В конце `init()` вызвать `#renderRoute` для текущего path
- [ ] `#renderRoute`: найти роут в `routes.data`, fallback `path: '*'`, вставить экран в `#content`
- [ ] На этом шаге ещё можно `innerHTML = screen.render()`, если `render()` возвращает **строку**

**Проверка:** меню Home / Auth / About, прямой заход на `/auth`, «Назад» в браузере, неизвестный URL → Not found.

---

## Шаг 2 — Стили (BEM + токены, без CSS Modules)

Ориентир: [styles.md](./styles.md), референс только как источник токенов.

- [ ] Вынести `_variables.scss`, `_mixins.scss`, `_reset.scss`, `_keyframes.scss`, `global.scss`
- [ ] Подключить через `@use` в `main.scss` (не deprecated `@import`)
- [ ] Лёгкие стили layout (`layout.scss`)
- [ ] В Sass **относительные** пути — webpack-алиас `@` для SCSS не работает

**Проверка:** страница не «сырой», токены цветов/шрифтов подключены.

---

## Шаг 3 — DX: алиасы в JS, Prettier, jsconfig, webpack

- [ ] Заменить относительные импорты в `client/src/**/*.js` на `@/…`
- [ ] `client/jsconfig.json`: `paths` `"@/*": ["./src/*"]` (**без** deprecated `baseUrl`; путь уже с `./src`)
- [ ] `client/.prettierrc` как в референсе по духу: tabs, singleQuote, semi false, trailingComma none, arrowParens avoid; опционально `@trivago/prettier-plugin-sort-imports` + `plugins` для Prettier 3
- [ ] `client/.prettierignore`: `node_modules`, `dist`
- [ ] Webpack:
  - [ ] `output.publicPath: '/'` (favicon/ассеты на вложенных роутах)
  - [ ] rule для картинок `asset/resource` при необходимости
  - [ ] `html-loader` → `options: { esModule: false }` — иначе `require('*.html')` будет объектом и упадёт `.trim()`

**Проверка:** `npm run format`, IDE резолвит `@/`, HMR после рестарта dev-сервера.

---

## Шаг 4 — База компонентов

Создать:

- `client/src/core/components/base-screen.component.js`
- `client/src/core/components/child.component.js`

- [ ] `BaseScreen`: `constructor({ title })` → `document.title`, `render()` бросает, `destroy()` пустой
- [ ] Экраны `extends BaseScreen`, передают `title`
- [ ] `ChildComponent`: `render()` бросает, `static get tag()` бросает (или требуй переопределение), `destroy()` пустой

**Проверка:** заголовки вкладок меняются при навигации.

---

## Шаг 5 — RenderService

Файл: `client/src/core/services/render.service.js`  
Экспорт: **singleton** `module.exports = new RenderService()`.

- [ ] `htmlToElement(html, components = [])`:
  - `<template>` → `innerHTML = html.trim()` → `content.firstElementChild`
  - вызвать замену тегов → вернуть элемент
- [ ] `#replaceComponentTags(root, components)`:
  - обойти элементы (`querySelectorAll('*')` + `Array.from`)
  - теги вида `component-…` → имя после префикса (`component-button` → `button`)
  - найти в массиве по **tag**:
    ```js
    components.find(c => (c.tag ?? c.constructor.tag) === tag)
    ```
    (обязательно сравнивать с `tag`, иначе найдётся первый попавшийся)
  - **класс или инстанс:**
    ```js
    Component instanceof ChildComponent
      ? Component.render()
      : new Component().render()
    ```
  - `element.replaceWith(node)`
  - если не найден — `console.error`, `continue`

**Зачем класс и инстанс:** класс — когда конструктор без обязательных пропсов; инстанс (`new Button({ children })`) — когда пропсы задаёшь снаружи. Подробнее — в чате / decisions §1.

**Проверка:** временно в консоли или тестом — `htmlToElement('<section><component-button></component-button></section>', […])`.

---

## Шаг 6 — Button

Папка: `client/src/components/ui/button/`

- [ ] `button.template.html` — например `<button class="button" type="button"></button>`
- [ ] `button.component.js`:
  - `extends ChildComponent`
  - `static tag = 'button'`
  - `constructor({ children, onClick /*, variant */ })` + `super()`
  - `render()`: DOM из шаблона через `renderService.htmlToElement(template)`, текст = `textContent` (не innerHTML), при необходимости `addEventListener('click', onClick)`, **вернуть элемент**
- [ ] `button.scss` + `@use` в `main.scss` (BEM: `.button`, позже `.button--green` / `--purple`)
- [ ] Подключить шаблон: `require('./button.template.html')` — после `esModule: false` это строка

**Частые ошибки:**

| Симптом | Причина |
|---------|---------|
| `html.trim is not a function` | html-loader без `esModule: false` |
| `Component is not a constructor` | в replace всегда `new Component()`, а передали инстанс |
| `Component "button" not found` | искали только `component.tag`, у инстанса tag на `constructor` |
| На экране нет кнопки / клик молчит | не передали массив в `htmlToElement` / не повесили `onClick` / `render` вернул строку вместо DOM |

---

## Шаг 7 — Свести Router + Home

- [ ] `HomeScreen.render()` возвращает результат `renderService.htmlToElement(html, [new Button({ children, onClick })])`
- [ ] В шаблоне парный тег: `<component-button></component-button>` (не самозакрывающийся)
- [ ] Роутер: `contentWrapper.replaceChildren(new route.Screen().render())` (экран уже отдаёт **Node**)
- [ ] Убрать временные `new Button` из `router.init` — проверка только через Home
- [ ] Остальные экраны: либо тоже через `htmlToElement` (строка → один корневой элемент), либо пока строка + отдельная ветка; на `main` About/Auth упрощены под DOM/строку — главное, чтобы `#content` не ломался

**Проверка:** `/` → видна кнопка → клик пишет в консоль; навигация не ломает layout.

---

## Шаг 8 — Сверка с `main` (самопроверка)

```bash
git diff main -- client/src/core client/src/components/ui/button client/src/screens/home.screen.js client/src/router
```

Не обязательно байт-в-байт. Важно поведение и решения:

- [ ] `static tag`, не `constructor.name`
- [ ] singleton RenderService
- [ ] инстансы + классы в массиве components
- [ ] алиасы `@/`
- [ ] BEM, не CSS Modules

Опционально отметь галочки в [02-render.md](./plan/02-render.md) по факту.

---

## Порядок коммитов (рекомендация на практике)

1. `feat(router): navigate and render screens into #content`
2. `style: BEM tokens and layout scss`
3. `chore(client): prettier, jsconfig paths, html-loader esModule`
4. `feat: BaseScreen and ChildComponent`
5. `feat: RenderService htmlToElement + component tags`
6. `feat(ui): Button + Home stub with component-button`

---

## Чего не делать в этой ветке

- Копировать целиком файлы с `main` без понимания
- Field / Auth form / store / fetch
- Переписывать server
- CSS Modules из референса

---

## Быстрые команды

```bash
# старт практики (уже на этой ветке от 678affb)
git checkout practice/from-678affb-replay

# подсмотреть эталон одного файла
git show main:client/src/core/services/render.service.js

# список всего, что было между базой и main
git log --oneline 678affb..main
git diff --stat 678affb..main
```
