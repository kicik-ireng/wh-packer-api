-- AlterTable
ALTER TABLE `PackingEntry` ADD COLUMN `part2rId` INTEGER NULL,
    ADD COLUMN `part4rId` INTEGER NULL;

-- CreateTable
CREATE TABLE `PartDatabase2r` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer` VARCHAR(191) NOT NULL,
    `segment` VARCHAR(191) NOT NULL,
    `assyNo16` VARCHAR(191) NOT NULL,
    `assyNo10` VARCHAR(191) NOT NULL,
    `oeNo` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `emiPartName` VARCHAR(191) NOT NULL,
    `kpp` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PartDatabase2r_assyNo16_key`(`assyNo16`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PartDatabase4r` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer` VARCHAR(191) NOT NULL,
    `segment` VARCHAR(191) NOT NULL,
    `assyNo16` VARCHAR(191) NOT NULL,
    `assyNo10` VARCHAR(191) NOT NULL,
    `oeNo` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `kpp` VARCHAR(191) NOT NULL,
    `kppNp` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PartDatabase4r_assyNo16_key`(`assyNo16`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PackingEntry` ADD CONSTRAINT `PackingEntry_part2rId_fkey` FOREIGN KEY (`part2rId`) REFERENCES `PartDatabase2r`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackingEntry` ADD CONSTRAINT `PackingEntry_part4rId_fkey` FOREIGN KEY (`part4rId`) REFERENCES `PartDatabase4r`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
