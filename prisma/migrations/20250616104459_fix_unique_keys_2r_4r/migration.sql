/*
  Warnings:

  - A unique constraint covering the columns `[assyNo16,oeNo]` on the table `PartDatabase2r` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `PartDatabase2r_assyNo16_key` ON `PartDatabase2r`;

-- CreateIndex
CREATE UNIQUE INDEX `PartDatabase2r_assyNo16_oeNo_key` ON `PartDatabase2r`(`assyNo16`, `oeNo`);
