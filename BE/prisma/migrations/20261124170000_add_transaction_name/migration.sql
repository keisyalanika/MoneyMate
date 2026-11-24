-- Tambah nama transaksi opsional
ALTER TABLE `transactions` ADD COLUMN `name` VARCHAR(100) NULL AFTER `category_id`;
