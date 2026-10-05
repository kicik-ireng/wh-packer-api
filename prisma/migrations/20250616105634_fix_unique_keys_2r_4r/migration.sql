/*
  Warnings:

  - A unique constraint covering the columns `[assyNo16,segment,oeNo]` on the table `PartDatabase4r` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `PartDatabase4r_assyNo16_segment_key` ON `PartDatabase4r`;

-- CreateIndex
CREATE UNIQUE INDEX `PartDatabase4r_assyNo16_segment_oeNo_key` ON `PartDatabase4r`(`assyNo16`, `segment`, `oeNo`);
