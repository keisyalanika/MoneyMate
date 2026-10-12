# AGENTS & BACKEND ARCHITECTURE GUIDELINES

## Project Overview
Backend REST API untuk MoneyMate (Pengelola Keuangan Mahasiswa & Portal Admin Kampus).
Dibangun dengan Node.js, Express, TypeScript, dan MySQL.

## Folder Structure (Clean Architecture Pattern)
- `src/config/`: Konfigurasi database pool, environment variables, dan konstanta JWT.
- `src/controllers/`: HTTP request & response handlers (parsing query, body, params, error status).
- `src/db/`: Database migrations, seed SQL, dan database connection scripts.
- `src/middleware/`: Authentication JWT (`protect`), authorization role (`admin`), dan validation middleware.
- `src/openapi/`: OpenAPI / Swagger spesifikasi dokumentasi API.
- `src/repositories/`: Data access layer / query langsung ke MySQL (opsional abstraksi dari services).
- `src/routes/`: Router endpoint Express per modul (`auth`, `transactions`, `budgets`, `categories`, `goals`, `summary`, `admin`, dll).
- `src/services/`: Business logic, transaction logic, hash password, kalkulasi keuangan.
- `src/types/`: Definisi tipe data TypeScript (Interface data model, DTO, Enums).
- `src/utils/`: Helper functions (JWT signer, formatters, response helpers).
- `src/app.ts`: Setup Express app, global middleware, dan mounting router.
- `src/index.ts`: Server entrypoint (listening port).
