import 'dotenv/config';
import prisma from '../src/config/prisma';

/**
 * Menyelaraskan saldo dompet dengan riwayat transaksi.
 *
 * Untuk setiap user (non-admin):
 * - ledger = total pemasukan - total pengeluaran
 * - Jika belum punya dompet, buat dompet dengan saldo = ledger.
 * - Jika saldo dompet berbeda dari ledger, catat satu transaksi penyesuaian
 *   ("Saldo awal / penyesuaian") sebesar selisihnya.
 *
 * Script ini idempotent: setelah dijalankan, selisihnya menjadi 0.
 */
async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'student' },
    orderBy: { id: 'asc' },
  });

  for (const user of users) {
    const [income, expense, wallets, walletCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId: user.id, type: 'income' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId: user.id, type: 'expense' },
        _sum: { amount: true },
      }),
      prisma.wallet.aggregate({
        where: { userId: user.id },
        _sum: { balance: true },
      }),
      prisma.wallet.count({ where: { userId: user.id } }),
    ]);

    const totalIncome = Number(income._sum.amount ?? 0);
    const totalExpense = Number(expense._sum.amount ?? 0);
    const ledger = totalIncome - totalExpense;
    const walletBalance = Number(wallets._sum.balance ?? 0);

    if (walletCount === 0) {
      await prisma.wallet.create({
        data: {
          userId: user.id,
          name: 'Dompet Utama',
          balance: Math.max(0, ledger),
          currency: 'IDR',
          isDefault: true,
        },
      });
      console.log(
        `[reconcile] user ${user.id} ${user.email}: buat dompet saldo ${Math.max(0, ledger)}`
      );
      continue;
    }

    const diff = walletBalance - ledger;
    if (Math.abs(diff) < 0.01) {
      console.log(`[reconcile] user ${user.id} ${user.email}: sudah sinkron (${walletBalance})`);
      continue;
    }

    const type = diff > 0 ? 'income' : 'expense';
    const categoryName = type === 'income' ? 'Tambah Saldo' : 'Kurangi Saldo';
    const categories = await prisma.category.findMany({
      where: { type },
      orderBy: { name: 'asc' },
    });
    const category =
      categories.find(
        (item) => item.name.trim().toLowerCase() === categoryName.toLowerCase()
      ) ??
      (await prisma.category.create({
        data: {
          name: categoryName,
          type,
          icon: type === 'income' ? 'plus-circle' : 'minus-circle',
        },
      }));

    if (!category) {
      console.warn(`[reconcile] user ${user.id}: kategori ${type} tidak ada, dilewati`);
      continue;
    }

    await prisma.transaction.create({
      data: {
        userId: user.id,
        type,
        amount: Math.abs(diff),
        categoryId: category.id,
        date: user.createdAt,
        note: 'Saldo awal / penyesuaian agar sesuai riwayat',
      },
    });

    console.log(
      `[reconcile] user ${user.id} ${user.email}: tambah ${type} ${Math.abs(diff)} (${category.name})`
    );
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('[reconcile] gagal:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
