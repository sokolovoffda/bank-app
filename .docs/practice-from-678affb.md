# Практика: от `678affb` → Router → Render → Button (+ Field)

**Ветка:** `practice/from-678affb-replay`  
**Старт:** коммит `678affb` (`prettier`) — код «до» роутинга и компонентов.  
**Эталон:** ветка/коммиты `main` после этого (смотри, не копируй сразу).

**Как пользоваться этим файлом**

1. Иди по шагам сверху вниз, не перескакивай.
2. Сначала сам → застрял → читай блок **Подсказка** → всё ещё тупик → `git show main:…` одного файла.
3. После каждого шага — **Проверка**. Не отмечай галочку, пока проверка не проходит.
4. Пиши код сам. Цель — понять, не «иметь файлы как на main».

**Связанные docs:** [01-router.md](./plan/01-router.md) · [02-render.md](./plan/02-render.md) · [styles.md](./styles.md) · [decisions.md](./decisions.md) (§1 tag, §4 destroy, §5 data-link, §7 textContent, §12 BEM)

---

## Карта прогресса

| Шаг | Тема | ~время |
|-----|------|--------|
| 0 | Окружение | 5 мин |
| 1 | Router | 1–2 ч |
| 2 | Стили BEM | 1–2 ч |
| 3 | DX (alias, prettier, html-loader) | 30–45 мин |
| 4 | BaseScreen + ChildComponent | 30–45 мин |
| 5 | RenderService | 1–2 ч |
| 6 | Button | 45–90 мин |
| 7 | Home + Router на DOM | 30–45 мин |
| 8 | Field + Auth-заглушка (желательно) | 45–90 мин |
| 9 | Сверка с main | 15 мин |

---

## Что уже есть на старте (`678affb`)

| Есть | Нет / недоделано |
|------|------------------|
| Webpack, `client/`, `Layout`, `routes.data.js`, экраны-заглушки | В `Router.init` только `innerHTML = layout` — **нет** кликов, `popstate`, смены `#content` |
| Alias `@` уже в `webpack.config.js` | В JS всё ещё `require('../…')` |
| `html-loader`, скрипт `format` (prettier) в `package.json` | Нет `.prettierrc`, `jsconfig.json`, `esModule: false` |
| Минимальный `main.scss` | Нет токенов, BaseScreen, ChildComponent, RenderService, Button/Field |

Экраны возвращают **строки** HTML. Layout уже содержит `#content` и ссылки с `data-link` — открой `layout.js` и убедись.

---

## Критерий «готово»

- [ ] Меню + Back/Forward меняют экран без reload; неизвестный URL → 404
- [ ] `BaseScreen` / `ChildComponent`, singleton `RenderService`
- [ ] `Button` (+ желательно `Field`) через `<component-*>` и `static tag`
- [ ] Home (и лучше Auth) собираются через `htmlToElement`; роутер — `replaceChildren` с **Node**
- [ ] JS-импорты через `@/…`; Prettier; html-шаблоны — **строки**
- [ ] Стили BEM + токены, **не** CSS Modules

**Не входит:** живой login, store, http, `$R` (это этап 3), правки server.

---

## Шаг 0 — Окружение

- [ ] Убедись, что ветка: `git checkout practice/from-678affb-replay` и `git status` чистый (или только этот doc)
- [ ] `cd client && npm install && npm run dev` → `http://localhost:7777`
- [ ] Открой `/` — виден layout/меню; контент маршрутов ещё **не** меняется (норма)

**Подсказка:** если порт занят — останови старый `npm run dev` или смени порт в webpack. `historyApiFallback: true` уже должен быть с этапа 0 — F5 на `/auth` не должен отдавать 404 от webpack.

---

## Шаг 1 — Дописать Router

**Файлы:** `client/src/router/router.js` (главный), при необходимости `layout.js` / экраны.

### 1.1 Клики по меню

- [ ] В `init()` после монтирования layout повесь **один** слушатель на `document` (делегирование)
- [ ] Ищи ссылку: `e.target.closest('a[data-link]')`
- [ ] Если нашли: `preventDefault`, `history.pushState({}, '', path)`, вызови `#renderRoute(path)`
- [ ] Если не нашли — ничего не делай (не перехватывай обычные `<a>`)

**Подсказка:** `closest` нужен, потому что клик может попасть во вложенный текст/иконку внутри `<a>`. Селектор именно `a[data-link]`, не все `a` — см. [decisions.md](./decisions.md) §5.

**Антипаттерн:** `document.querySelectorAll('a').forEach(a => a.onclick = …)` — хрупко при динамике.

### 1.2 Кнопки Назад / Вперёд

- [ ] `window.addEventListener('popstate', () => this.#renderRoute(window.location.pathname))`

**Подсказка:** `pushState` **не** стреляет `popstate`. `popstate` — только когда историю меняет браузер (Back/Forward). Поэтому после `pushState` рендер вызываешь **сам**.

### 1.3 Первый рендер

- [ ] В конце `init()` вызови `#renderRoute(window.location.pathname)` — иначе прямой заход на `/auth` покажет пустой `#content`

### 1.4 `#renderRoute(path)`

- [ ] `const content = document.getElementById('content')`
- [ ] Найди роут: `routes.find(r => r.path === path)`
- [ ] Если нет — возьми роут с `path: '*'` (Not found)
- [ ] Создай экран: `new route.Screen().render()`
- [ ] На этом шаге экраны ещё возвращают **строку** → можно `content.innerHTML = html`

**Подсказка по структуре `routes.data.js`:** там уже есть `{ path, Screen }`. Не хардкодь `if (path === '/')` в роутере — данные в массиве.

**Подсказка:** сохрани `this.currentScreen`, если хочешь потом вызывать `destroy()` (полноценно — на этапе polish; сейчас заготовка ок).

### Проверка шага 1

- [ ] Клик Home → Auth → About меняет URL и текст в `#content` **без** reload
- [ ] Back/Forward работают
- [ ] `/foo` или любой мусор → Not found
- [ ] F5 на `/auth` — страница жива

---

## Шаг 2 — Стили (BEM + токены)

**Ориентир:** [styles.md](./styles.md). Референс — только цвета/размеры, **не** копируй `.module.scss`.

### 2.1 Токены и слои

- [ ] `client/src/styles/_variables.scss` — `$primary`, `$secondary`, `$bg-page`, `$bg-block`, `$gray`, `$text-gray`, `$white`, `$font`, `$radius`, `$gap`
- [ ] `_mixins.scss` — хотя бы `transition`, по желанию `flex-horizontal-center`, `dashboard-section`
- [ ] `_reset.scss`, `_keyframes.scss`, `global.scss` (`body`, ссылки, `input`)
- [ ] `main.scss` собирает всё через **`@use`**, не `@import`

**Подсказка Dart Sass:**

```scss
@use './variables' as *;
@use './mixins' as *;
```

`as *` — чтобы писать `$primary`, а не `variables.$primary`. `@use` только в начале файла.

**Подсказка:** webpack-алиас `@` **не работает** в Sass. Пути только относительные: `../../../styles/variables`.

### 2.2 Layout

- [ ] `layout.scss` рядом с layout (или в styles) — блок `.layout`, элементы `__header` / `__nav` / `__content`
- [ ] Подключи в `main.scss`

### Проверка шага 2

- [ ] Фон/шрифт/меню выглядят «банковски», не дефолтный белый HTML
- [ ] В DevTools у кнопки меню нет инлайнового хаоса — классы BEM

---

## Шаг 3 — DX: алиасы, Prettier, webpack

### 3.1 Алиасы в JS

- [ ] Во всех `client/src/**/*.js` замени `require('../…')` / `import './…'` на `@/…` где путь идёт в `src`
- [ ] **Исключения:** `webpack.config.js` (это Node), соседний шаблон `./button.template.html`, локальный scss рядом с компонентом можно оставить относительным **или** подключать из `main.scss`

**Подсказка:** `@` уже в `resolve.alias` webpack. Пример: `@/core/services/render.service`, `@/screens/home.screen`.

### 3.2 jsconfig (IDE)

- [ ] `client/jsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

**Подсказка:** **не** ставь `baseUrl` — в TS 6+ deprecated. Префикс `./src` уже внутри `paths`.

### 3.3 Prettier

- [ ] `client/.prettierrc`: tabs, `singleQuote`, `semi: false`, `trailingComma: "none"`, `arrowParens: "avoid"`
- [ ] Опционально: пакет `@trivago/prettier-plugin-sort-imports` + в rc `"plugins": ["@trivago/prettier-plugin-sort-imports"]` и `importOrder` (Prettier 3 **сам** плагины не подхватывает)
- [ ] `.prettierignore`: `node_modules`, `dist`
- [ ] `npm run format`

### 3.4 Webpack доработки

- [ ] `output.publicPath: '/'` — иначе на `/auth` относительный favicon/картинка 404
- [ ] При необходимости rule картинок: `type: 'asset/resource'`
- [ ] **Важно для шаблонов:**

```js
{
  test: /\.html$/,
  loader: 'html-loader',
  options: { esModule: false }
}
```

**Подсказка:** html-loader v5 по умолчанию отдаёт ES-модуль. `require('./x.html')` становится `{ default: '…' }`, не строкой → в RenderService упадёт `html.trim is not a function`. `esModule: false` чинит это под CommonJS.

### Проверка шага 3

- [ ] IDE не орёт на `@/…`
- [ ] После рестарта `npm run dev` всё собирается
- [ ] (позже на Button) `typeof require('./button.template.html') === 'string'`

---

## Шаг 4 — BaseScreen и ChildComponent

**Создать:**

- `client/src/core/components/base-screen.component.js`
- `client/src/core/components/child.component.js`

### 4.1 BaseScreen

- [ ] `constructor({ title })` — если title есть, `document.title = title`
- [ ] `render()` — `throw new Error('…')` (экран обязан переопределить)
- [ ] `destroy() {}` — пустая заготовка

### 4.2 Экраны

- [ ] `HomeScreen` / `AuthScreen` / `AboutScreen` / `NotFoundScreen` → `extends BaseScreen`
- [ ] В `constructor` первой строкой: `super({ title: 'Home' })` (и т.д.)

**Подсказка:** без `super()` в derived constructor нельзя трогать `this` — получишь ошибку движка. Даже если у родителя конструктор «пустой по смыслу».

### 4.3 ChildComponent

- [ ] То же: `render()` бросает, `destroy()` пустой
- [ ] `static get tag()` бросает *или* документируй, что наследник обязан задать `static tag = '…'`

**Подсказка:** UI-кнопка/поле будут `extends ChildComponent`. Экраны — `extends BaseScreen`. Не путай.

### Проверка шага 4

- [ ] При переходе Home → Auth заголовок вкладки меняется
- [ ] `new ChildComponent().render()` в консоли (если экспортируешь) должен кинуть ошибку

---

## Шаг 5 — RenderService

**Файл:** `client/src/core/services/render.service.js`  
**Экспорт:** `module.exports = new RenderService()` — **один** экземпляр на приложение (singleton).

### 5.1 `htmlToElement(html, components = [])`

- [ ] `document.createElement('template')`
- [ ] `template.innerHTML = html.trim()`
- [ ] Корень: `template.content.firstElementChild` (не `firstChild` — там может быть текстовая нода)
- [ ] Вызови `#replaceComponentTags(element, components)`
- [ ] `return element`

**Подсказка:** `<template>` не попадает в документ «как есть» — удобно парсить HTML в DocumentFragment безопасно для структуры.

### 5.2 `#replaceComponentTags`

Алгоритм:

1. Скопируй массив: `const pool = [...components]` (зачем — см. ниже про несколько Field)
2. `Array.from(root.querySelectorAll('*'))`
3. Для каждого элемента: `tagName = element.tagName.toLowerCase()`
4. Если не начинается с `component-` → `continue`
5. `tag = tagName.replace(/^component-/, '')` → из `component-button` получится `button`
6. Найди в `pool`:

```js
const index = pool.findIndex(c => {
  const componentTag = c.tag ?? c.constructor.tag
  return componentTag === tag   // ← сравнение обязательно!
})
```

7. Если не найден → `console.error`, `continue`
8. Возьми `Component = pool[index]`
9. Если это **инстанс** (`instanceof ChildComponent`) — `pool.splice(index, 1)` и `Component.render()`
10. Если это **класс** — `new Component().render()` (класс в пуле можно оставить)
11. `element.replaceWith(node)`

### Подсказки: класс vs инстанс

| В массиве | Когда | Как рендерит сервис |
|-----------|--------|---------------------|
| `Button` (класс) | конструктор без обязательных пропсов | `new Button().render()` |
| `new Button({ children: 'Ok' })` | нужны пропсы | уже готовый объект → `.render()` |

`<component-button>` в HTML **не передаёт** `{ children }` в конструктор. Поэтому для кнопки почти всегда кладёшь **инстанс**.

### Подсказки: `static tag`

```js
class Button extends ChildComponent {
  static tag = 'button'
}
Button.tag                 // 'button'
new Button({…}).tag        // undefined
new Button({…}).constructor.tag  // 'button'
```

Отсюда `c.tag ?? c.constructor.tag`.

### Подсказки: частые баги find

| Код | Что будет |
|-----|-----------|
| `find(c => c.tag ?? c.constructor.tag)` **без** `=== tag` | Возьмёт первый truthy кандидат — почти всегда не тот |
| `find(c => c.tag === tag)` только | Инстанс не найдётся (`tag` на классе) |
| Всегда `new Component()` | Падение на инстансе: `is not a constructor` |
| Два `<component-field>` + два инстанса Field, но find всегда первый | Оба слота получат один и тот же Field → `splice` после использования инстанса |

### Проверка шага 5

Пока Button нет — можно временно проверить парсинг:

```js
const el = renderService.htmlToElement('<section><h1>Hi</h1></section>')
console.log(el.tagName) // SECTION
```

Замену тегов проверяй на шаге 6–7.

---

## Шаг 6 — Button

**Папка:** `client/src/components/ui/button/`

```
button.component.js
button.template.html
button.scss
```

### 6.1 Шаблон

- [ ] `button.template.html`:

```html
<button class="button" type="button"></button>
```

Один корневой элемент — `firstElementChild` его и вернёт.

### 6.2 Класс

- [ ] `extends ChildComponent`
- [ ] `static tag = 'button'`
- [ ] `constructor({ children, onClick, variant } = {}) { super(); … }`
- [ ] Если нет `children` — `throw new Error('Children is empty!')`
- [ ] В `render()`:
  1. `this.element = renderService.htmlToElement(template)` — второй аргумент `[]` (вложенных component-* нет)
  2. `this.element.textContent = this.children` — **не** `innerHTML`
  3. если `onClick` — `addEventListener('click', this.onClick)`
  4. если `variant` — `classList.add('button--' + variant)` (`green` / `purple`)
  5. `return this.element`

**Подсказка `super()`:** обязателен в derived constructor до `this.…`.

**Подсказка:** не делай `return (this.element.textContent = this.children)` — выражение присваивания вернёт **строку**, а роутеру нужен DOM-узел.

**Подсказка безопасности:** пользовательский/динамический текст — только `textContent` ([decisions.md](./decisions.md) §7).

### 6.3 Стили BEM

- [ ] В `button.scss`: блок `.button`, модификаторы `.button--green`, `.button--purple` (не отдельные `.green` / `.purple` как в CSS Modules референса)
- [ ] Цвета из `$gray`, `$primary`, `$secondary`
- [ ] `@use` файла в `main.scss`

**Подсказка:** вместо deprecated `lighten()` лучше `color.adjust` из `sass:color` (иначе warning при сборке).

### Проверка шага 6 (изолированно)

Временно в любом месте после init:

```js
const btn = new Button({
  children: 'Click',
  variant: 'purple',
  onClick: () => console.log('ok')
}).render()
document.getElementById('content').append(btn)
```

- [ ] Кнопка видна, стили есть, клик логирует
- [ ] Убери этот временный код

### Если ошибка

| Симптом | Что проверить |
|---------|----------------|
| `html.trim is not a function` | шаг 3.4 `esModule: false`, рестарт dev |
| Пустая кнопка | задал ли `children`, вызываешь ли `render()` |
| Стили не те | подключен ли `button.scss` в `main.scss`, BEM-класс в HTML |

---

## Шаг 7 — Свести Home + Router на DOM

### 7.1 Home

- [ ] `require` `renderService` и `Button`
- [ ] `render()` возвращает:

```js
return renderService.htmlToElement(
  `<section>
    <h1>Home</h1>
    <component-button></component-button>
  </section>`,
  [
    new Button({
      children: 'test',
      variant: 'green',
      onClick: () => console.log(123)
    })
  ]
)
```

**Подсказка:** тег пиши парным `<component-button></component-button>`. Самозакрывающийся `<component-button/>` в HTML-парсере для кастомных тегов ведёт себя непредсказуемо.

**Подсказка:** порядок в массиве = порядок замены одинаковых тегов (если инстансы снимаются из pool).

### 7.2 Router

- [ ] Замени `innerHTML = …` на:

```js
contentWrapper.replaceChildren(new route.Screen().render())
```

(и то же для 404)

**Подсказка:** `replaceChildren` ждёт **Node**. Если экран вернул строку — будет плохо. Значит **все** экраны, которые роутер так монтирует, должны отдавать Element (хотя бы через `htmlToElement('<section>…</section>')` без components).

- [ ] About / Not found / Auth (пока без Field) — оберни строку в `htmlToElement`
- [ ] Убери любой debug-`new Button` из `router.init`

### Проверка шага 7

- [ ] `/` — кнопка на месте, клик → `123` в консоли
- [ ] Переходы по меню не ломают layout
- [ ] В Elements нет оставшихся `<component-button>`

---

## Шаг 8 — Field + Auth-заглушка (закрыть этап 2)

По плану [02-render.md](./plan/02-render.md) нужны оба примитива и один экран из шаблона.

### 8.1 Field

Папка `client/src/components/ui/field/`:

- [ ] `field.template.html`:

```html
<label class="field">
  <input class="field__input" />
</label>
```

- [ ] `Field extends ChildComponent`, `static tag = 'field'`
- [ ] Конструктор: `{ placeholder, type = 'text', value = '', name, variant }`
- [ ] Без `name` — throw
- [ ] В `render()`: собрать DOM, найти `input`, выставить `placeholder` / `type` / `value` / `name` обычными свойствами (не innerHTML)
- [ ] `field.scss` — `.field`, `.field__input`, focus-within с `$primary`; подключить в `main.scss`

**Подсказка:** маски карты / number-only — потом (DOM-слой / этап Home). Сейчас хватит обычного input.

### 8.2 Auth stub

- [ ] Шаблон с двумя `<component-field>` и одним `<component-button>`
- [ ] В массив: `new Field({…email})`, `new Field({…password})`, `new Button({ children: 'Submit', variant: 'purple', onClick })`
- [ ] Живой login / fetch — **не** делать

**Подсказка:** два Field с одним `tag` работают только если RenderService **снимает** использованный инстанс из pool (`splice`). Иначе оба слота возьмут первый Field.

### Проверка шага 8

- [ ] `/auth` — два поля + кнопка, стили, клик Submit логирует
- [ ] Значения в inputs можно печатать
- [ ] Галочки в `02-render.md` можно проставить

---

## Шаг 9 — Сверка с main

```bash
git log --oneline 678affb..main
git diff --stat 678affb..main
git show main:client/src/core/services/render.service.js
```

Чеклист решений (не байт-в-байт):

- [ ] `static tag`, не `constructor.name`
- [ ] singleton RenderService
- [ ] поддержка класса **и** инстанса; find с `=== tag`
- [ ] алиасы `@/`
- [ ] BEM, не CSS Modules
- [ ] пользовательский текст через `textContent`

---

## Рекомендуемые коммиты на практике

1. `feat(router): navigate and render screens into #content`
2. `style: BEM tokens and layout scss`
3. `chore(client): prettier, jsconfig, html-loader esModule`
4. `feat: BaseScreen and ChildComponent`
5. `feat: RenderService htmlToElement + component tags`
6. `feat(ui): Button + Home with component-button`
7. `feat(ui): Field + Auth stub`

---

## Чего не делать

- Копипаст целых файлов с `main` «чтобы сдалось»
- CSS Modules из референса
- Store / http / настоящий login
- Переписывать `server/`
- Мини-`$R` — это [03-dom.md](./plan/03-dom.md), после этой практики

---

## Шпаргалка команд

```bash
git checkout practice/from-678affb-replay
cd client && npm run dev

# один файл эталона
git show main:client/src/components/ui/button/button.component.js

# что менялось между стартом и main
git diff --stat 678affb..main
```

---

## Когда звать ментора

1. Проверка шага не проходит **и** таблица ошибок не помогла.
2. Непонятно, **зачем** класс vs инстанс / `static tag` (лучше спросить, чем выучить костыль).
3. Хочешь сравнить свой RenderService с эталоном после шага 5–7 — принеси свой файл, не «перепиши мне».
