# Этап 0 — Каркас

**Оценка:** 0.5–1 день  
**Статус:** ⬜ в работе  
**Цель:** пустой проект собирается и открывается в браузере. Банка, роутера и API ещё нет.

**Готово, если:** `npm run dev` в `client/` открывает страницу на `http://localhost:7777`; база `bank_app` существует и к ней можно подключиться.

**Документы:** [architecture.md](../architecture.md), [database.md](../database.md), [decisions.md](../decisions.md) §9.

---

## Client

Собрать пайплайн Webpack, который позже проглотит весь SPA.

- [x] Папка `client/` создана
- [x] `package.json`: скрипты `dev` и `build`
- [x] `webpack.config.js`:
  - [x] entry → `src/index.js`
  - [x] alias `@` → `src/`
  - [x] Babel 7: `babel-loader` + `@babel/preset-env` (не Babel 6 из референса)
  - [x] SCSS: `sass-loader` → `css-loader` → extract (`mini-css-extract-plugin`)
  - [x] HTML: `html-webpack-plugin` + `html-loader`
  - [x] dev-server: порт **7777**, `historyApiFallback: true`
- [x] `.env`: `SERVER_URL=http://localhost:3001` (прокинуть в бандл; `fetch` пока не писать)
- [x] `.gitignore`: `node_modules`, `dist`, `.env`
- [x] `src/index.html` + `src/index.js` + `src/styles/main.scss`
- [x] Заглушка на экране: текст `Bank App` (через `textContent` или статичный HTML)

**Не делать:** Router, Store, компоненты, `fetch`.

**Сдать:** дерево `client/`, `webpack.config.js`, скрин/описание того, что видно в браузере.

---



## Server

Пока папка-маркер и инфраструктура БД. Express — этап 0b.

- [x] Папка `server/` создана
- [ ] `package.json` (`private: true`, пока без зависимостей Express)
- [ ] Короткий `README.md`: Express появится на этапе 0b
- [x] PostgreSQL: создана БД `bank_app`
- [ ] Пользователь БД с правами на `bank_app`
- [ ] Проверка подключения (`psql` / pgAdmin)
- [ ] *(опционально)* выполнить DDL из [schema.sql](../schema.sql)

**Не делать:** `express()`, роуты, JWT, `pg` в коде.

**Сдать:** подтверждение, что БД `bank_app` открывается.