/*
  Warnings:

  - A unique constraint covering the columns `[codeNo]` on the table `PartDatabase2r` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codeNo]` on the table `PartDatabase4r` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codeNo` to the `PartDatabase2r` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codeNo` to the `PartDatabase4r` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PartDatabase2r` ADD COLUMN `codeNo` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `PartDatabase4r` ADD COLUMN `codeNo` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PartDatabase2r_codeNo_key` ON `PartDatabase2r`(`codeNo`);

-- CreateIndex
CREATE UNIQUE INDEX `PartDatabase4r_codeNo_key` ON `PartDatabase4r`(`codeNo`);
