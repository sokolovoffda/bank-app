# Этап 4 — Store

**Оценка:** 1–2 дня  
**Статус:** ⬜ в работе (по подшагам)  
**Цель:** единственный источник правды на клиенте; UI обновляется по подписке, не по «снимку» из constructor.

**Готово, если:** `login` / `logout` меняют state, подписчик получает notify, после reload user поднимается из localStorage (гидратация).

**Документы:** [architecture.md](../architecture.md) (Store), [decisions.md](../decisions.md) §2, §3.

**Важно:** без Proxy (референс его использует — мы **нет**). Явные методы + `notify()`. Живой API login — этапы 5–6.

---

## Подшаги (делай по порядку)

### 4.1 — `StorageService` ← **сейчас здесь**

- [ ] Файл: `client/src/core/services/storage.service.js`
- [ ] Методы: `get(key)`, `set(key, value)`, `remove(key)` (имена на выбор, смысл тот же)
- [ ] Внутри: `localStorage` + `JSON.parse` / `JSON.stringify`
- [ ] `get` при пустом ключе → `null` (не падать)
- [ ] Экспорт singleton **или** класс — как удобнее; для старта достаточно `module.exports = new StorageService()`

**Не делать:** store, UI, ключи auth пока можно захардкодить строками в следующем шаге.

**Проверка:** в консоли браузера после `require`/`import` через временный `window.storage = …` или тест в `index.js` на 2 минуты:

```js
storage.set('demo', { ok: true })
console.log(storage.get('demo')) // { ok: true }
storage.remove('demo')
```

---

### 4.2 — Каркас Store (singleton, state, getState)

- [ ] Файл: `client/src/core/store/store.js`
- [ ] Начальный state: `{ user: null }` (токен лучше **не** класть в state — только в storage; или положи `accessToken` если хочешь видеть в getState — зафиксируй одно)
- [ ] `getState()` → текущий объект state
- [ ] Экспорт одного экземпляра: `module.exports = new Store()` (или `getInstance` как в референсе — нам проще singleton-файл)

**Проверка:** `store.getState()` → `{ user: null }`

---

### 4.3 — Подписки: `subscribe` + `notify`

- [ ] Массив слушателей (например `this.listeners = []`)
- [ ] `subscribe(fn)` — добавить `fn`, **вернуть** функцию отписки `() => { … убрать fn … }`
- [ ] Приватный/`#notify()` — вызвать всех подписчиков (передать `getState()` или без аргументов — выбери и держись)
- [ ] Пока **нет** login — вызови `notify` вручную из временного метода для проверки

**Проверка:**

```js
const unsub = store.subscribe(state => console.log('upd', state))
// как-нибудь дерни notify
unsub()
// следующий notify уже не логирует
```

---

### 4.4 — `login` / `logout` + запись в Storage

- [ ] Константы ключей: например `user`, `accessToken` (файл `constants` или строки в store)
- [ ] `login(user, accessToken)`: обновить state → `storage.set` → `#notify()`
- [ ] `logout()`: `user: null` → `storage.remove` оба ключа → `#notify()`
- [ ] **Без Proxy:** меняй поля явно, потом `notify()`

**Проверка (консоль или временная кнопка на Home):**

```js
store.login({ email: 'a@b.c', name: 'Test' }, 'fake-token')
store.getState().user // объект
localStorage // ключи на месте
store.logout()
store.getState().user // null
```

---

### 4.5 — Гидратация при старте

- [ ] В конструкторе Store (или сразу при создании): прочитать `user` (и при необходимости token) из Storage
- [ ] Если есть user → начальный state уже с ним
- [ ] После F5 залогиненный «фейком» пользователь остаётся, пока не `logout`

**Проверка:** `login` → F5 → `getState().user` всё ещё есть.

---

### 4.6 — UI-подписка (header / кусок layout)

- [ ] Один простой кусок UI (например в layout header: «Guest» / email)
- [ ] Подписка при монтировании, в `destroy` — `this.unsubscribe?.()`
- [ ] Router уже зовёт `destroy` у экрана; для layout, если подписка на всё приложение — подписаться один раз в `Router.init` / отдельный компонент Header

**Запрещено:** один раз прочитать `getState()` в constructor и больше не слушать.

**Проверка:** кнопка «fake login» / вызов из консоли → текст в header меняется без reload; logout → снова Guest.

---

### 4.7 — Сверка чеклиста

- [ ] Все пункты Client ниже
- [ ] Убрать временные `window.store` / дебаг-кнопки или оставить одну осознанную демо-кнопку до этапа 6

---

## Client (сводка)

- [ ] Singleton store, начальный state: `{ user: null }`
- [ ] `getState()`, `subscribe(fn)` → функция отписки
- [ ] Явные методы: `login(user, token)`, `logout()`; при необходимости `updateCard`
- [ ] `notify()` после изменений (**без Proxy**)
- [ ] `StorageService`: get/set/remove в localStorage (`user`, `accessToken`)
- [ ] При старте: прочитать storage → восстановить state
- [ ] Один кусок UI подписан и отписан в `destroy` (или жизненный цикл layout)

**Не делать:** реальный login через API.

**Сдать:** `store.js`, `storage.service.js`, демо подписки.

---

## Server

- [x] Не трогаем
