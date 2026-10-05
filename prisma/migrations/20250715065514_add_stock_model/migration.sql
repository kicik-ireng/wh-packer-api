-- AlterTable
ALTER TABLE `packingentry` ADD COLUMN `pic1Id` INTEGER NULL,
    ADD COLUMN `pic2Id` INTEGER NULL,
    ADD COLUMN `pic3Id` INTEGER NULL;

-- CreateTable
CREATE TABLE `Stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `part2rId` INTEGER NULL,
    `part4rId` INTEGER NULL,
    `totalStock` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Stock_part2rId_part4rId_key`(`part2rId`, `part4rId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PackingEntry` ADD CONSTRAINT `PackingEntry_pic1Id_fkey` FOREIGN KEY (`pic1Id`) REFERENCES `Manpower`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackingEntry` ADD CONSTRAINT `PackingEntry_pic2Id_fkey` FOREIGN KEY (`pic2Id`) REFERENCES `Manpower`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackingEntry` ADD CONSTRAINT `PackingEntry_pic3Id_fkey` FOREIGN KEY (`pic3Id`) REFERENCES `Manpower`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_part2rId_fkey` FOREIGN KEY (`part2rId`) REFERENCES `PartDatabase2r`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_part4rId_fkey` FOREIGN KEY (`part4rId`) REFERENCES `PartDatabase4r`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
