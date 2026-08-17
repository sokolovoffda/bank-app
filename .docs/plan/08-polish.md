# Этап 8 — Полировка

**Оценка:** 2–3 дня  
**Статус:** ⬜ не начат  
**Цель:** проект можно показать за 2 минуты: собирается, не течёт, понятный README.

**Готово, если:** `destroy()` вызывается при смене роута; `npm run build` проходит; README объясняет запуск client + server + БД.

---

## Client

- [ ] `document.title` в `BaseScreen` на каждом экране
- [ ] Router вызывает `currentScreen.destroy()` перед новым экраном
- [ ] Нет висящих listeners / store-подписок после ухода с экрана
- [ ] Production build (`npm run build`) открывается без ошибок консоли
- [ ] README во фронте или в корне: как запустить, порты, `.env`

---

## Server

- [ ] README: переменные `.env`, миграции, seed, `npm run dev`
- [ ] Скрипты `dev` / `start` / `db:migrate` / `db:seed` работают с чистого клона (по инструкции)
- [ ] Health-check живой
- [ ] Секреты не в git (`JWT_SECRET`, пароль БД)
