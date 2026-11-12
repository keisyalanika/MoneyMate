import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/prisma';

/**
 * Seed idempotent: aman dijalankan berulang kali.
 * Data awal mengikuti `src/db/migration.sql` (kategori bawaan + akun demo).
 */
const defaultCategories = [
  { name: 'Gaji Bulanan', type: 'income' as const, icon: 'wallet' },
  { name: 'Freelance', type: 'income' as const, icon: 'laptop' },
  { name: 'Beasiswa', type: 'income' as const, icon: 'award' },
  { name: 'Transfer Orang Tua', type: 'income' as const, icon: 'heart' },
  { name: 'Investasi', type: 'income' as const, icon: 'trending-up' },
  { name: 'Lainnya (Pemasukan)', type: 'income' as const, icon: 'plus-circle' },
  { name: 'Makanan & Minuman', type: 'expense' as const, icon: 'utensils' },
  { name: 'Transportasi', type: 'expense' as const, icon: 'bus' },
  { name: 'Belanja', type: 'expense' as const, icon: 'shopping-cart' },
  { name: 'Tagihan & Utilitas', type: 'expense' as const, icon: 'file-text' },
  { name: 'Pendidikan', type: 'expense' as const, icon: 'book' },
  { name: 'Hiburan', type: 'expense' as const, icon: 'music' },
  { name: 'Kesehatan', type: 'expense' as const, icon: 'activity' },
  { name: 'Lainnya (Pengeluaran)', type: 'expense' as const, icon: 'minus-circle' },
];

const defaultUsers = [
  { name: 'Admin MoneyMate', email: 'admin@moneymate.com', password: 'admin123', role: 'admin' as const },
  { name: 'Keisya Exa Haniyah', email: 'keisyaexahaniyah@gmail.com', password: 'Admin123', role: 'student' as const },
];

async function main() {
  for (const category of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: { name: category.name, type: category.type },
    });

    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: { icon: category.icon },
      });
    } else {
      await prisma.category.create({ data: category });
    }
  }
  console.log(`✔ ${defaultCategories.length} kategori siap`);

  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: { role: user.role, isActive: true },
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });
  }
  console.log(`✔ ${defaultUsers.length} akun demo siap`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed gagal:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
