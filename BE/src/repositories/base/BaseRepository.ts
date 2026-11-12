import { Prisma } from '../../generated/prisma/client';
import prisma from '../../config/prisma';

/**
 * Tipe client yang dipakai repository.
 * Bisa berupa PrismaClient biasa, atau client yang terikat ke transaksi
 * (`Prisma.TransactionClient`) ketika beberapa repository harus berjalan atomik.
 */
export type DbClient = Prisma.TransactionClient;

/**
 * Base class untuk semua repository.
 * Satu-satunya layer yang boleh menyentuh Prisma.
 */
export abstract class BaseRepository {
  protected readonly db: DbClient;

  constructor(tx?: Prisma.TransactionClient) {
    this.db = tx ?? prisma;
  }

  /** Menjalankan beberapa operasi repository dalam satu transaksi database. */
  static runInTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: { timeout?: number }
  ): Promise<T> {
    return prisma.$transaction(fn, { timeout: options?.timeout ?? 15000 });
  }
}
