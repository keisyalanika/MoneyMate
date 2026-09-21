# MoneyMate - REST API Specification

Documentasi lengkap RESTful API MoneyMate. Digunakan oleh **FE (Frontend Web Admin)** dan **MOBILE (Flutter App)**.

**Base URL:** `http://localhost:5000/api`

---

## 1. Summary API
### GET `/summary`
Mengambil rangkuman total saldo, total pemasukan, total pengeluaran, dan progres anggaran.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalBalance": 12500000,
    "totalIncome": 18000000,
    "totalExpense": 5500000,
    "activeBudgetsCount": 4,
    "recentTransactionsCount": 12
  },
  "message": "Financial summary retrieved successfully"
}
```

---

## 2. Transactions API
### GET `/transactions`
Mengambil daftar riwayat transaksi.

**Query Parameters:**
- `type` (optional): `INCOME` | `EXPENSE`
- `search` (optional): Filter kata kunci judul/catatan

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "tx-001",
      "title": "Gaji Bulanan PT MoneyMate",
      "amount": 15000000,
      "type": "INCOME",
      "categoryId": "cat-inc-1",
      "categoryName": "Gaji",
      "categoryIcon": "wallet",
      "date": "2026-09-01T08:00:00.000Z",
      "notes": "Transfer gaji pokok"
    }
  ]
}
```

### POST `/transactions`
Menambahkan transaksi baru (Pemasukan atau Pengeluaran).

**Request Body:**
```json
{
  "title": "Makan Siang Resto SE",
  "amount": 75000,
  "type": "EXPENSE",
  "categoryId": "cat-exp-1",
  "notes": "Makan bersama tim"
}
```

### DELETE `/transactions/:id`
Menghapus transaksi berdasarkan ID.

---

## 3. Categories API
### GET `/categories`
Mengambil daftar kategori transaksi.

---

## 4. Budgets API
### GET `/budgets`
Mengambil daftar anggaran bulanan dan akumulasi pemakaian.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "bg-001",
      "categoryId": "cat-exp-1",
      "categoryName": "Makanan & Minuman",
      "limitAmount": 3000000,
      "spentAmount": 1850000,
      "percentage": 61.67
    }
  ]
}
```
