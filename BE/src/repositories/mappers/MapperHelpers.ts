/**
 * Helper konversi dari model Prisma ke bentuk response lama (mysql2),
 * supaya kontrak API tidak berubah saat migrasi ke ORM.
 */

/** DECIMAL dari Prisma/MySQL -> number (dulu mysql2 mengembalikan string). */
export const toNumber = (value: unknown): number => Number(value ?? 0);

/** Boolean Prisma -> 0/1 seperti TINYINT(1) MySQL (dipakai FE/MOBILE). */
export const toFlag = (value: boolean | null | undefined): number => (value ? 1 : 0);

/** Kolom DATE -> 'YYYY-MM-DD' (aman untuk `.slice(0, 10)` di FE & `DateTime.parse` Flutter). */
export const toDateOnly = (value: Date | null | undefined): string | undefined =>
  value ? value.toISOString().slice(0, 10) : undefined;

/** Kolom TIMESTAMP/DATETIME tetap dikirim sebagai Date (JSON ISO string), sama seperti sebelumnya. */
export const toTimestamp = (value: Date | null | undefined): Date | undefined => value ?? undefined;

/** String nullable -> undefined agar konsisten dengan response lama yang tidak memuat field kosong. */
export const nullable = <T>(value: T | null | undefined): T | undefined => value ?? undefined;
