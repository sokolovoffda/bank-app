# Bank App — стили

Визуал берём из референса `reference-bank-app`.  
Правила написания — **BEM + глобальные токены**. CSS Modules **не используем**.

---

## Слои

| Слой | Где | Что туда класть |
|------|-----|-----------------|
| Токены | `client/src/styles/_variables.scss` | цвета, шрифт, `$radius`, `$gap` |
| Reset | `client/src/styles/_reset.scss` | сброс браузерных стилей |
| Mixins | `client/src/styles/_mixins.scss` | повторяющиеся куски (`dashboard-section`, `flex-horizontal-center`, `transition`) |
| Анимации | `client/src/styles/_keyframes.scss` | `@keyframes` и утилитарные классы `.fade-in`, `.bounce` |
| Глобальные | `client/src/styles/global.scss` | `body`, `a`, `input` |
| Компонент | рядом с JS: `layout.scss`, позже `button.scss` | только этот блок |

Точка входа: `client/src/styles/main.scss` (уже импортируется в `index.js`).

---

## Именование: BEM

Формат: `блок`, `блок__элемент`, `блок--модификатор`.

```html
<div class="layout">
  <header class="layout__header"></header>
  <nav class="layout__nav"></nav>
  <main class="layout__content"></main>
</div>

<button class="button button--purple">Send</button>
```

Правила:

- один блок = один файл (`button.scss` → только `.button`)
- не пишем длинные цепочки `.layout .header .nav a`
- модификатор через `--`, не отдельный класс цвета вроде `.purple` на кнопке
- в HTML класс пишем явно: `class="button"` (не hashed CSS Module)

---

## Цвета и размеры

Только переменные из `_variables.scss`:

| Токен | Значение | Зачем |
|-------|----------|--------|
| `$primary` | `#917cff` | акцент, hover ссылок |
| `$secondary` | `#08f0c8` | success / green-кнопки |
| `$bg-page` | `#1b1d1f` | фон страницы |
| `$bg-block` | `#0f1112` | карточки / секции |
| `$gray` | `#181a1e` | кнопки, поля |
| `$text-gray` | `#4f5157` | placeholder / вторичный текст |
| `$white` | `#fdfdfd` | основной текст |
| `$radius` | `0.7rem` | скругление |
| `$gap` | `30px` | стандартный отступ |

Не хардкодить `#917cff` в компоненте — брать `$primary`.

---

## Как писать новый компонент

1. Файл рядом с JS: `button/button.scss`
2. Сверху (Dart Sass, не `@import`):
   ```scss
   @use '../styles/variables' as *;
   @use '../styles/mixins' as *;
   ```
   `as *` — чтобы писать `$primary` и `@include transition`, а не `variables.$primary`.
3. Один корневой блок `.button`
4. Подключить файл: либо `require('./button.scss')` в JS, либо `@use` в `main.scss` на этапе каркаса

`@use` должен быть **в начале файла**, до любых селекторов. Один и тот же partial Sass подключает один раз.

---

## Почему не CSS Modules

В референсе `*.module.scss` + `import styles from '...'` и hashed-классы. Это потребует `css-loader` `modules: true` и подстановку классов в RenderService.

Пока шаблоны — обычные строки HTML с `class="..."`. Modules и BEM **не смешиваем**. Если понадобятся modules — отдельное решение в [decisions.md](./decisions.md).
