-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Manpower` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nik` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Manpower_nik_key`(`nik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackingReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggalPacking` DATETIME(3) NOT NULL,
    `lineNo` VARCHAR(191) NOT NULL,
    `pic1Id` INTEGER NULL,
    `pic2Id` INTEGER NULL,
    `pic3Id` INTEGER NULL,
    `keterangan` VARCHAR(191) NULL,
    `qty4R` INTEGER NULL,
    `qty2R` INTEGER NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackingEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `packingReportId` INTEGER NOT NULL,
    `no` INTEGER NOT NULL,
    `jamMulai` VARCHAR(191) NOT NULL,
    `jamSelesai` VARCHAR(191) NOT NULL,
    `menitPacking` INTEGER NOT NULL,
    `packingReqNo` VARCHAR(191) NOT NULL,
    `explannerNo` VARCHAR(191) NOT NULL,
    `customerPartNo` VARCHAR(191) NOT NULL,
    `qtyPlan` INTEGER NOT NULL,
    `qtyActualPacking` INTEGER NOT NULL,
    `balancePlanVsActual` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `Incoming4rId` INTEGER NULL,
    `Incoming2rId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Incoming4r` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prId` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `cust` VARCHAR(191) NOT NULL,
    `seg` VARCHAR(191) NOT NULL,
    `assyNo16` VARCHAR(191) NOT NULL,
    `assyNo10` VARCHAR(191) NOT NULL,
    `oeNo` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `kpp` VARCHAR(191) NOT NULL,
    `kppNp` VARCHAR(191) NOT NULL,
    `qtyPlan` INTEGER NOT NULL,
    `qtyActual` INTEGER NULL DEFAULT 0,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Incoming4r_prId_key`(`prId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Incoming2r` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prId` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `cust` VARCHAR(191) NOT NULL,
    `segment` VARCHAR(191) NOT NULL,
    `assyNo16` VARCHAR(191) NOT NULL,
    `assyNo10` VARCHAR(191) NOT NULL,
    `oeNo` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `EMIpartname` VARCHAR(191) NOT NULL,
    `kpp` VARCHAR(191) NOT NULL,
    `qtyPlan` INTEGER NOT NULL,
    `qtyActual` INTEGER NULL DEFAULT 0,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Incoming2r_prId_key`(`prId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductionProblemReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no` INTEGER NOT NULL,
    `jamMulai` DATETIME(3) NOT NULL,
    `jamSelesai` DATETIME(3) NOT NULL,
    `menit` INTEGER NOT NULL,
    `problemItem` VARCHAR(191) NOT NULL,
    `pic` VARCHAR(191) NOT NULL,
    `slOrDl` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PackingReport` ADD CONSTRAINT `PackingReport_pic1Id_fkey` FOREIGN KEY (`pic1Id`) REFERENCES `Manpower`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackingReport` ADD CONSTRAINT `PackingReport_pic2Id_fkey` FOREIGN KEY (`pic2Id`) REFERENCES `Manpower`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackingReport` ADD CONSTRAINT `PackingReport_pic3Id_fkey` FOREIGN KEY (`pic3Id`) REFERENCES `Manpower`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackingEntry` ADD CONSTRAINT `PackingEntry_packingReportId_fkey` FOREIGN KEY (`packingReportId`) REFERENCES `PackingReport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackingEntry` ADD CONSTRAINT `PackingEntry_Incoming4rId_fkey` FOREIGN KEY (`Incoming4rId`) REFERENCES `Incoming4r`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackingEntry` ADD CONSTRAINT `PackingEntry_Incoming2rId_fkey` FOREIGN KEY (`Incoming2rId`) REFERENCES `Incoming2r`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
