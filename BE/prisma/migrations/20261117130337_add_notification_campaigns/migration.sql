-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `campaign_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `notification_campaigns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_id` INTEGER NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `message` TEXT NULL,
    `type` VARCHAR(20) NOT NULL DEFAULT 'Info',
    `audience` VARCHAR(50) NOT NULL DEFAULT 'Semua pengguna',
    `recipient_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_notifications_campaign` ON `notifications`(`campaign_id`);

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `notification_campaigns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_campaigns` ADD CONSTRAINT `notification_campaigns_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
