import { AppError } from './AppError';

interface PrismaLikeError {
  code?: string;
  meta?: { target?: unknown; field_name?: string; model_name?: string };
  name?: string;
  message?: string;
}

/**
 * Menerjemahkan error Prisma menjadi AppError yang siap dikirim ke klien.
 * Return null bila error bukan error Prisma yang dikenal.
 */
export const mapPrismaError = (error: unknown): AppError | null => {
  const err = error as PrismaLikeError;
  if (!err || typeof err.code !== 'string') return null;

  const target = err.meta?.target;
  const field =
    Array.isArray(target) ? target.join(', ') : typeof target === 'string' ? target : undefined;

  switch (err.code) {
    case 'P2002':
      return AppError.conflict(
        field ? `Data sudah terdaftar pada kolom: ${field}.` : 'Data sudah terdaftar.',
        'DUPLICATE_ENTRY',
        err.meta
      );
    case 'P2025':
      return AppError.notFound('Data tidak ditemukan.', 'NOT_FOUND');
    case 'P2003':
      return AppError.badRequest(
        'Data masih terhubung dengan data lain sehingga tidak bisa diproses.',
        'FOREIGN_KEY_CONSTRAINT',
        err.meta
      );
    case 'P2014':
      return AppError.badRequest(
        'Perubahan ini akan memutus relasi data yang masih dibutuhkan.',
        'RELATION_VIOLATION',
        err.meta
      );
    case 'P2011':
      return AppError.badRequest('Kolom wajib tidak boleh kosong.', 'NULL_CONSTRAINT', err.meta);
    case 'P2000':
      return AppError.badRequest('Nilai terlalu panjang untuk kolom tersebut.', 'VALUE_TOO_LONG', err.meta);
    default:
      return null;
  }
};
