# Этап 4 — Store

**Оценка:** 1–2 дня  
**Статус:** ⬜ не начат  
**Цель:** единственный источник правды на клиенте; UI обновляется по подписке, не по «снимку» из constructor.

**Готово, если:** `login` / `logout` меняют state, подписчик получает notify, после reload user поднимается из localStorage (гидратация).

**Документы:** [architecture.md](../architecture.md) (Store), [decisions.md](../decisions.md) §2, §3.

---

## Client

- [ ] Singleton store, начальный state: `{ user: null }`
- [ ] `getState()`, `subscribe(fn)` → функция отписки
- [ ] Явные методы: `login(user, token)`, `logout()`; при необходимости `updateCard`
- [ ] `notify()` после изменений (**без Proxy**)
- [ ] `StorageService`: get/set/remove в localStorage (`user`, `accessToken`)
- [ ] При старте: прочитать storage → восстановить state
- [ ] Один кусок UI (например header-заглушка) подписан в `mount` и отписан в `destroy`

**Запрещено:** сохранить `state` в constructor и больше не слушать store.

**Не делать:** реальный login через API (этап 5–6). Для проверки достаточно вызвать `store.login` вручную из консоли или временной кнопки.

**Сдать:** `store.js`, `storage.service.js`, демо подписки.

---

## Server

- [ ] Не трогаем (к этому моменту 0b желательно уже в работе: фронту скоро понадобится живой login)
