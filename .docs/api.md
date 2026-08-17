# Bank App — HTTP API (контракт)

Контракт между **frontend (vanilla JS)** и **backend (Express + PostgreSQL)**.

**Base URL (dev):** `http://localhost:3001`  
**Префикс API:** `/api`  
**Полный пример:** `http://localhost:3001/api/auth/login`

**Env на фронте:**

```env
SERVER_URL=http://localhost:3001
```

Клиент собирает URL: `` `${SERVER_URL}/api${path}` ``

---

## Общие правила

- Request/Response: `application/json`
- Успех: HTTP 2xx + JSON body
- Ошибка: `{ "message": "..." }`
- Защищённые роуты: `Authorization: Bearer <accessToken>`
- Пароли и `password_hash` **никогда** не возвращаются

---

## Auth

### POST `/api/auth/login`

**Body:**

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response 200:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Dmitriy",
    "avatarPath": "https://..."
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response 401:**

```json
{ "message": "Invalid email or password" }
```

---

### POST `/api/auth/register`

**Body:**

```json
{
  "email": "new@example.com",
  "password": "secret123",
  "name": "New User"
}
```

**Response 201:** как login (`user` + `accessToken`); на сервере создаётся карта.

**Response 409:**

```json
{ "message": "User already exists" }
```

---

## Cards

### GET `/api/cards/by-user`

Требует auth. Карта текущего пользователя.

**Response 200:**

```json
{
  "id": 1,
  "number": "4111111111111111",
  "balance": 12500.50,
  "cvc": "123",
  "expireDate": "12/28"
}
```

---

### PATCH `/api/cards/balance/top-up`

**Body:**

```json
{ "amount": 1000 }
```

**Response 200:** обновлённый объект card (или `{ balance }`).

---

### PATCH `/api/cards/balance/withdrawal`

**Body:**

```json
{ "amount": 500 }
```

**Response 400** (недостаточно средств):

```json
{ "message": "Insufficient funds" }
```

---

### PATCH `/api/cards/transfer-money`

**Body:**

```json
{
  "amount": 1000,
  "fromCardNumber": "4111111111111111",
  "toCardNumber": "5555555555554444"
}
```

**Response 200:** успех (можно вернуть новый balance или `{ message: "OK" }`).

---

## Transactions

### GET `/api/transactions?orderBy=desc`

**Response 200:**

```json
{
  "transactions": [
    {
      "id": 101,
      "type": "TOP_UP",
      "amount": 5000,
      "createdAt": "2026-08-10T14:30:00.000Z"
    },
    {
      "id": 102,
      "type": "WITHDRAWAL",
      "amount": 1500,
      "createdAt": "2026-08-05T09:00:00.000Z"
    }
  ]
}
```

**Типы:** `TOP_UP`, `WITHDRAWAL`, `TRANSFER_OUT`, `TRANSFER_IN`

UI (как в референсе): `TOP_UP` → «Income», остальное → «Expense».

---

## Statistics

### GET `/api/statistics`

**Response 200** — массив из двух элементов:

```json
[
  { "value": 75000 },
  { "value": 32500 }
]
```

- `[0]` — Income (TOP_UP + TRANSFER_IN)
- `[1]` — Expense (WITHDRAWAL + TRANSFER_OUT)

Считается на сервере SQL-агрегацией по `transactions`.

---

## Users (контакты / поиск)

### GET `/api/users`

**Query:** `searchTerm` (опционально)

**Response 200:**

```json
[
  {
    "name": "Anna",
    "avatarPath": "https://...",
    "card": {
      "number": "5555555555554444"
    }
  }
]
```

Не возвращать текущего пользователя в списке контактов (опционально, на усмотрение сервера).

---

## Health (для проверки)

### GET `/api/health`

**Response 200:**

```json
{ "status": "ok", "db": "connected" }
```

---

## HTTP Client на фронте (ожидаемое поведение)

```js
async function request({ path, method = 'GET', body }) {
  const headers = { 'Content-Type': 'application/json' }
  const token = storage.getItem('accessToken')
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${SERVER_URL}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || res.statusText)
  return data
}
```

---

## Связанные документы

- [backend.md](./backend.md) — план Express-сервера
- [database.md](./database.md) — схема PostgreSQL
- [plan.md](./plan.md) — этапы
