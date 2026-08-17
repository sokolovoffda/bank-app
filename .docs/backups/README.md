# Bank App — бэкап PostgreSQL

> **bcp** — утилита **SQL Server**.  
> В **PostgreSQL** аналог — **`pg_dump`** (создать) и **`pg_restore`** / **`psql`** (восстановить).

Папка для файлов бэкапа: `docs/bank-app/backups/`

---

## Быстрый бэкап (SQL-файл, удобно хранить в проекте)

Из PowerShell или Git Bash (подставь версию PostgreSQL и пользователя):

```bash
"C:/Program Files/PostgreSQL/16/bin/pg_dump" -U postgres -d bank_app --no-owner --no-acl -f "C:/Users/d.sokolov/Desktop/learning/JS/docs/bank-app/backups/bank_app.sql"
```

Параметры:

| Флаг | Зачем |
|------|-------|
| `-d bank_app` | имя базы |
| `--no-owner --no-acl` | без привязки к пользователю Windows/Linux — проще переносить |
| `-f path` | куда сохранить файл |

Спросит пароль postgres (или задай `PGPASSWORD` в env).

---

## Бэкап в custom-формате (сжатый, для больших БД)

```bash
"C:/Program Files/PostgreSQL/16/bin/pg_dump" -U postgres -d bank_app -F c -f "C:/Users/d.sokolov/Desktop/learning/JS/docs/bank-app/backups/bank_app.dump"
```

Восстановление:

```bash
"C:/Program Files/PostgreSQL/16/bin/pg_restore" -U postgres -d bank_app --clean --if-exists "C:/Users/d.sokolov/Desktop/learning/JS/docs/bank-app/backups/bank_app.dump"
```

---

## Восстановить из `.sql`

```bash
# создать пустую БД, если нужно
"C:/Program Files/PostgreSQL/16/bin/psql" -U postgres -c "CREATE DATABASE bank_app ENCODING 'UTF8';"

# залить дамп
"C:/Program Files/PostgreSQL/16/bin/psql" -U postgres -d bank_app -f "C:/Users/d.sokolov/Desktop/learning/JS/docs/bank-app/backups/bank_app.sql"
```

---

## Рекомендуемый порядок для dev

1. `schema.sql` — структура  
2. `seed.sql` — тестовые данные  
3. `pg_dump` → положить `backups/bank_app.sql` как снимок «БД с seed»

Так у тебя в репозитории:

- скрипты создания (версионируются)
- опционально дамп после seed (быстро развернуть одной командой)

---

## Что коммитить в git

| Файл | Коммитить? |
|------|------------|
| `schema.sql`, `seed.sql` | ✅ да |
| `backups/bank_app.sql` (dev, без секретов prod) | ✅ можно, если маленький |
| `backups/*.dump` | ⚠️ обычно в `.gitignore` (бинарник) |
| пароли prod | ❌ никогда |

В `backups/.gitignore` уже игнорируются `.dump`; `.sql` можно хранить явно.

---

## Переменные окружения (опционально)

```bash
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=your_password
```

После этого:

```bash
pg_dump -d bank_app -f docs/bank-app/backups/bank_app.sql
```

---

## Связанные файлы

- [schema.sql](../schema.sql)
- [seed.sql](../seed.sql)
- [database.md](../database.md)
