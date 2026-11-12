# AGENTS & BACKEND ARCHITECTURE GUIDELINES

## Project Overview
Backend REST API untuk MoneyMate (Pengelola Keuangan Mahasiswa & Portal Admin Kampus).
Dibangun dengan Node.js, Express, TypeScript, dan MySQL.

## Folder Structure (Clean Architecture + OOP)
- `src/config/`: Konfigurasi (`prisma.ts` = Prisma Client singleton, konstanta JWT).
- `src/controllers/`: HTTP layer. Setiap modul adalah **class** (`UserController`, ...) dengan method arrow function dibungkus `asyncHandler`. Singleton diekspor di `src/controllers/index.ts`.
- `src/errors/`: `AppError` (error operasional + factory `badRequest/unauthorized/forbidden/notFound/conflict/...`) dan `PrismaErrorMapper` (P2002/P2025/P2003 → `AppError`).
- `src/responses/`: `AppBaseResponse` — formatter response (`success`, `created`, `updated`, `deleted`, `error`, `raw`).
- `src/middleware/`: `protect`/`admin` (JWT), `asyncHandler` (penerus rejection ke error handler), dan `errorHandler` + `notFound` (global error handler).
- `src/openapi/`: OpenAPI / Swagger spesifikasi dokumentasi API.
- `src/repositories/`: Data access layer. **Satu-satunya tempat Prisma dipakai.** Berisi `BaseRepository` (abstract), interface `I<Domain>Repository`, mapper Prisma → DTO snake_case, dan class `<Domain>Repository`.
- `src/routes/`: Router endpoint Express per modul. Memanggil method dari instance controller (`authController.login`, dst.).
- `src/services/`: Business logic sebagai class (`UserService`, `TransactionService`, ...) dengan constructor injection repository; singleton diekspor di `src/services/index.ts`.
- `src/types/`: Definisi tipe data TypeScript (Interface data model, DTO, Enums).
- `src/utils/`: Helper functions (JWT signer).
- `src/app.ts`: Setup Express app, global middleware, mounting router, lalu `notFound` + `errorHandler` di paling akhir.
- `src/index.ts`: Server entrypoint (listening port).
- `prisma/`: `schema.prisma`, `migrations/`, dan `seed.ts`.

### Aturan layer
1. Controller tidak boleh menyentuh database sama sekali.
2. Service tidak boleh memakai Prisma langsung — selalu lewat repository yang di-inject.
3. Repository mengembalikan bentuk DTO lama (`snake_case`, flag `0/1`, `DATE` → `YYYY-MM-DD`) lewat mapper agar response API tidak berubah.
4. `$queryRaw` hanya dipakai untuk operasi yang tidak bisa diekspresikan Prisma (`FOR UPDATE`, agregasi korelasi) dan tetap berada di dalam repository.
5. Controller tidak memakai `try/catch`. Lemparkan `AppError` (atau biarkan error Prisma naik) — `asyncHandler` + `errorHandler` yang memformat response error `{ success:false, message, code, details? }`.
6. Semua response sukses memakai `AppBaseResponse`. Pengecualian: endpoint `/auth/*` yang kontraknya flat memakai `AppBaseResponse.raw`.
