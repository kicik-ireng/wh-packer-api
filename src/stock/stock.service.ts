import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(private prisma: PrismaService) {}

  async findStock2r() {
    try {
      const parts = await this.prisma.partDatabase2r.findMany();
      const stocks = await this.prisma.stock.findMany({
        where: { part2rId: { not: null } },
      });

      return parts.map((part) => {
        const matchingStocks = stocks.filter((s) => s.part2rId === part.id);

        const totalStock = matchingStocks.reduce((sum, stock) => {
          return sum + (stock.totalStock || 0);
        }, 0);

        const stock = stocks.find((s) => s.part2rId === part.id);

        return {
          part2r: part,
          totalStock,
          rack: stock?.rack ?? null,
        };
      });
    } catch (error: any) {
      this.logger.error(`Gagal mengambil stock 2R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil stock 2R: ' + error.message);
    }
  }

  async findStock4r() {
    try {
      const parts = await this.prisma.partDatabase4r.findMany({});
      const stocks = await this.prisma.stock.findMany({
        where: { part4rId: { not: null } },
      });

      return parts.map((part) => {
        const matchingStocks = stocks.filter((s) => s.part4rId === part.id);

        const totalStock = matchingStocks.reduce((sum, stock) => {
          return sum + (stock.totalStock || 0);
        }, 0);

        const stock = stocks.find((s) => s.part4rId === part.id);

        return {
          part4r: part,
          totalStock,
          rack: stock?.rack ?? null,
        };
      });
    } catch (error: any) {
      this.logger.error(`Gagal mengambil stock 4R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal mengambil stock 4R: ' + error.message);
    }
  }

  async updateRack(partId: number, rack: string, type: '2r' | '4r') {
    try {
      const whereClause =
        type === '2r' ? { part2rId: partId } : { part4rId: partId };

      const existing = await this.prisma.stock.findFirst({ where: whereClause });

      if (existing) {
        return await this.prisma.stock.update({
          where: { id: existing.id },
          data: { rack },
        });
      } else {
        return await this.prisma.stock.create({
          data: {
            rack,
            ...(type === '2r' ? { part2rId: partId } : { part4rId: partId }),
            totalStock: 0,
          },
        });
      }
    } catch (error: any) {
      this.logger.error(`Gagal update rack part ${type} ID ${partId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal update rack: ' + error.message);
    }
  }

  async updateStockPerPart2R(partId: number, newQty: number) {
    try {
      if (newQty < 0) throw new BadRequestException('Stock tidak boleh negatif');

      return await this.prisma.$transaction(async (prisma) => {
        const existing = await prisma.stock.findFirst({
          where: { part2rId: partId },
        });

        const qtyBefore = existing?.totalStock || 0;
        const qtyChange = newQty - qtyBefore;
        const qtyAfter = newQty;

        let result;
        if (existing) {
          result = await prisma.stock.update({
            where: { id: existing.id },
            data: { totalStock: newQty },
          });
        } else {
          result = await prisma.stock.create({
            data: { part2rId: partId, totalStock: newQty },
          });
        }

        // Record stock transaction if change occurred
        if (qtyChange !== 0) {
          await prisma.stockTransaction.create({
            data: {
              part2rId: partId,
              part4rId: null,
              type: 'ADJUSTMENT',
              qtyBefore,
              qtyChange,
              qtyAfter,
              pic: 'Admin / Manual Adjustment',
              reference: 'MANUAL-STOCK-2R',
              description: `Penyesuaian manual stok 2R dari ${qtyBefore} menjadi ${qtyAfter}`,
            },
          });
        }

        return result;
      });
    } catch (error: any) {
      this.logger.error(`Gagal update stock per part 2R ID ${partId}: ${error.message}`, error.stack);
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal update stock: ' + error.message);
    }
  }

  async updateStockPerPart4R(partId: number, newQty: number) {
    try {
      if (newQty < 0) throw new BadRequestException('Stock tidak boleh negatif');

      return await this.prisma.$transaction(async (prisma) => {
        const existing = await prisma.stock.findFirst({
          where: { part4rId: partId },
        });

        const qtyBefore = existing?.totalStock || 0;
        const qtyChange = newQty - qtyBefore;
        const qtyAfter = newQty;

        let result;
        if (existing) {
          result = await prisma.stock.update({
            where: { id: existing.id },
            data: { totalStock: newQty },
          });
        } else {
          result = await prisma.stock.create({
            data: { part4rId: partId, totalStock: newQty },
          });
        }

        // Record stock transaction if change occurred
        if (qtyChange !== 0) {
          await prisma.stockTransaction.create({
            data: {
              part2rId: null,
              part4rId: partId,
              type: 'ADJUSTMENT',
              qtyBefore,
              qtyChange,
              qtyAfter,
              pic: 'Admin / Manual Adjustment',
              reference: 'MANUAL-STOCK-4R',
              description: `Penyesuaian manual stok 4R dari ${qtyBefore} menjadi ${qtyAfter}`,
            },
          });
        }

        return result;
      });
    } catch (error: any) {
      this.logger.error(`Gagal update stock per part 4R ID ${partId}: ${error.message}`, error.stack);
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal update stock: ' + error.message);
    }
  }

  // Ekspor 2R
  async exportStock2rToExcel(response: Response) {
    try {
      const data = await this.findStock2r();
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Stock 2R');

      // Header baris judul "#2R"
      sheet.mergeCells('A1:I1');
      sheet.getCell('A1').value = '#2R';
      sheet.getCell('A1').font = { bold: true, size: 14 };
      sheet.getCell('A1').alignment = { horizontal: 'center' };

      const header = [
        'NO',
        'Customer',
        'Seg.',
        'Assy No 16',
        'OE. No',
        'ModeL',
        'EMI Part name',
        'Total Stock',
        'Rack',
      ];

      sheet.addRow(header);

      data.forEach((item, index) => {
        const part = item.part2r;
        sheet.addRow([
          index + 1,
          part.customer,
          part.segment,
          part.assyNo16,
          part.oeNo,
          part.model,
          part.emiPartName,
          item.totalStock,
          item.rack || '-',
        ]);
      });

      this.styleExcelSheet(sheet, header.length);

      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename=stock-2r.xlsx',
      );
      await workbook.xlsx.write(response);
      response.end();
    } catch (error: any) {
      this.logger.error(`Gagal ekspor stock 2R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal ekspor stock 2R ke Excel');
    }
  }

  // Ekspor 4R
  async exportStock4rToExcel(response: Response) {
    try {
      const data = await this.findStock4r();
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Stock 4R');

      // Header baris judul "#4R"
      sheet.mergeCells('A1:I1');
      sheet.getCell('A1').value = '#4R';
      sheet.getCell('A1').font = { bold: true, size: 14 };
      sheet.getCell('A1').alignment = { horizontal: 'center' };

      const header = [
        'NO',
        'Cust.',
        'Seg.',
        'Assy No 16',
        'OE. No',
        'Model',
        'KPP',
        'Total Stock',
        'Rack',
      ];

      sheet.addRow(header);

      data.forEach((item, index) => {
        const part = item.part4r;
        sheet.addRow([
          index + 1,
          part.customer,
          part.segment,
          part.assyNo16,
          part.oeNo,
          part.model,
          part.kpp,
          item.totalStock,
          item.rack || '-',
        ]);
      });

      this.styleExcelSheet(sheet, header.length);

      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename=stock-4r.xlsx',
      );
      await workbook.xlsx.write(response);
      response.end();
    } catch (error: any) {
      this.logger.error(`Gagal ekspor stock 4R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal ekspor stock 4R ke Excel');
    }
  }

  // ✅ Fungsi untuk styling tabel
  private styleExcelSheet(sheet: ExcelJS.Worksheet, headerLength: number) {
    const headerRow = sheet.getRow(2);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDCE6F1' },
      };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    sheet.autoFilter = {
      from: { row: 2, column: 1 },
      to: { row: 2, column: headerLength },
    };

    sheet.columns.forEach((column) => {
      let maxLength = 12;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const len = cell.value?.toString().length || 0;
        if (len > maxLength) maxLength = len;
      });
      column.width = maxLength + 2;
    });

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }
    });
  }

  // Upload 2R
  async uploadStock2r(file: Express.Multer.File) {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer as any);
      const sheet = workbook.worksheets[0];
      
      let updated = 0;
      const rows = sheet.getRows(3, sheet.rowCount) || [];

      for (const row of rows) {
        const assyNo16 = row.getCell(4).value?.toString()?.trim();
        const oeNo = row.getCell(5).value?.toString()?.trim();
        const stockVal = row.getCell(8).value;
        const totalStock = parseInt(stockVal?.toString() || '0', 10);
        const rackVal = row.getCell(9).value?.toString()?.trim();
        const rack = rackVal && rackVal !== '-' ? rackVal : null;

        if (!assyNo16 || !oeNo) continue;

        const part = await this.prisma.partDatabase2r.findFirst({
          where: { assyNo16, oeNo },
        });

        if (part) {
          const existingStock = await this.prisma.stock.findFirst({
            where: { part2rId: part.id },
          });

          const qtyBefore = existingStock?.totalStock || 0;
          const newQty = Math.max(0, totalStock);
          const qtyChange = newQty - qtyBefore;

          if (existingStock) {
            await this.prisma.stock.update({
              where: { id: existingStock.id },
              data: { totalStock: newQty, rack },
            });
          } else {
            await this.prisma.stock.create({
              data: { part2rId: part.id, totalStock: newQty, rack },
            });
          }

          if (qtyChange !== 0) {
            await this.prisma.stockTransaction.create({
              data: {
                part2rId: part.id,
                part4rId: null,
                type: 'ADJUSTMENT',
                qtyBefore,
                qtyChange,
                qtyAfter: newQty,
                pic: 'Upload Excel',
                reference: 'EXCEL-IMPORT-2R',
                description: `Import stok 2R dari Excel (Assy: ${assyNo16})`,
              },
            });
          }
          updated++;
        }
      }
      return { message: `Berhasil update ${updated} stock 2R` };
    } catch (error: any) {
      this.logger.error(`Gagal upload stock 2R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal upload stock 2R: ' + error.message);
    }
  }

  // Upload 4R
  async uploadStock4r(file: Express.Multer.File) {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer as any);
      const sheet = workbook.worksheets[0];
      
      let updated = 0;
      const rows = sheet.getRows(3, sheet.rowCount) || [];

      for (const row of rows) {
        const segment = row.getCell(3).value?.toString()?.trim();
        const assyNo16 = row.getCell(4).value?.toString()?.trim();
        const oeNo = row.getCell(5).value?.toString()?.trim();
        const stockVal = row.getCell(8).value;
        const totalStock = parseInt(stockVal?.toString() || '0', 10);
        const rackVal = row.getCell(9).value?.toString()?.trim();
        const rack = rackVal && rackVal !== '-' ? rackVal : null;

        if (!segment || !assyNo16 || !oeNo) continue;

        const part = await this.prisma.partDatabase4r.findFirst({
          where: { segment, assyNo16, oeNo },
        });

        if (part) {
          const existingStock = await this.prisma.stock.findFirst({
            where: { part4rId: part.id },
          });

          const qtyBefore = existingStock?.totalStock || 0;
          const newQty = Math.max(0, totalStock);
          const qtyChange = newQty - qtyBefore;

          if (existingStock) {
            await this.prisma.stock.update({
              where: { id: existingStock.id },
              data: { totalStock: newQty, rack },
            });
          } else {
            await this.prisma.stock.create({
              data: { part4rId: part.id, totalStock: newQty, rack },
            });
          }

          if (qtyChange !== 0) {
            await this.prisma.stockTransaction.create({
              data: {
                part2rId: null,
                part4rId: part.id,
                type: 'ADJUSTMENT',
                qtyBefore,
                qtyChange,
                qtyAfter: newQty,
                pic: 'Upload Excel',
                reference: 'EXCEL-IMPORT-4R',
                description: `Import stok 4R dari Excel (Assy: ${assyNo16})`,
              },
            });
          }
          updated++;
        }
      }
      return { message: `Berhasil update ${updated} stock 4R` };
    } catch (error: any) {
      this.logger.error(`Gagal upload stock 4R: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal upload stock 4R: ' + error.message);
    }
  }
  // Ekspor Semua Stock (2R & 4R) Beda Sheet dalam 1 File Excel
  async exportAllStockToExcel(response: Response) {
    try {
      const [data2r, data4r] = await Promise.all([
        this.findStock2r(),
        this.findStock4r(),
      ]);

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'WH-PACKER System';
      workbook.created = new Date();

      // ==========================================
      // SHEET 1: Stock 2R
      // ==========================================
      const sheet2r = workbook.addWorksheet('Stock 2R');
      sheet2r.mergeCells('A1:I1');
      sheet2r.getCell('A1').value = '#2R - STOCK FINISHED GOODS';
      sheet2r.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FF1E3A8A' } };
      sheet2r.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      sheet2r.getRow(1).height = 30;

      const header2r = [
        'NO',
        'Customer',
        'Seg.',
        'Assy No 16',
        'OE. No',
        'ModeL',
        'EMI Part name',
        'Total Stock',
        'Rack',
      ];
      sheet2r.addRow(header2r);
      sheet2r.getRow(2).height = 24;

      data2r.forEach((item, index) => {
        const part = item.part2r;
        sheet2r.addRow([
          index + 1,
          part.customer || '-',
          part.segment || '-',
          part.assyNo16 || '-',
          part.oeNo || '-',
          part.model || '-',
          part.emiPartName || '-',
          item.totalStock ?? 0,
          item.rack || '-',
        ]);
      });

      this.styleExcelSheet(sheet2r, header2r.length);

      // ==========================================
      // SHEET 2: Stock 4R
      // ==========================================
      const sheet4r = workbook.addWorksheet('Stock 4R');
      sheet4r.mergeCells('A1:I1');
      sheet4r.getCell('A1').value = '#4R - STOCK FINISHED GOODS';
      sheet4r.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FF1E3A8A' } };
      sheet4r.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      sheet4r.getRow(1).height = 30;

      const header4r = [
        'NO',
        'Cust.',
        'Seg.',
        'Assy No 16',
        'OE. No',
        'Model',
        'KPP',
        'Total Stock',
        'Rack',
      ];
      sheet4r.addRow(header4r);
      sheet4r.getRow(2).height = 24;

      data4r.forEach((item, index) => {
        const part = item.part4r;
        sheet4r.addRow([
          index + 1,
          part.customer || '-',
          part.segment || '-',
          part.assyNo16 || '-',
          part.oeNo || '-',
          part.model || '-',
          part.kpp || '-',
          item.totalStock ?? 0,
          item.rack || '-',
        ]);
      });

      this.styleExcelSheet(sheet4r, header4r.length);

      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename=stock-inventory-2r-4r.xlsx',
      );
      await workbook.xlsx.write(response);
      response.end();
    } catch (error: any) {
      this.logger.error(`Gagal ekspor semua stock ke Excel: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal ekspor semua stock ke Excel: ' + error.message);
    }
  }

  // Upload dan Adjust Stock (Mendukung 2R & 4R dalam 1 File Excel)
  async uploadAdjustAllStock(file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('File Excel tidak ditemukan');
    }

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer as any);

      let updated2r = 0;
      let updated4r = 0;

      for (const worksheet of workbook.worksheets) {
        const sheetName = worksheet.name.toLowerCase();
        const titleCell = worksheet.getCell('A1').value?.toString()?.toLowerCase() || '';
        const headerCell7 = worksheet.getCell('G2').value?.toString()?.toLowerCase() || '';

        const is2R =
          sheetName.includes('2r') ||
          titleCell.includes('#2r') ||
          headerCell7.includes('emi');

        const is4R =
          sheetName.includes('4r') ||
          titleCell.includes('#4r') ||
          headerCell7.includes('kpp');

        // Jika sheet teridentifikasi sebagai 2R
        if (is2R) {
          const rows = worksheet.getRows(3, worksheet.rowCount) || [];
          for (const row of rows) {
            const assyNo16 = row.getCell(4).value?.toString()?.trim();
            const oeNo = row.getCell(5).value?.toString()?.trim();
            const stockVal = row.getCell(8).value;
            const totalStock = parseInt(stockVal?.toString() || '0', 10);
            const rackVal = row.getCell(9).value?.toString()?.trim();
            const rack = rackVal && rackVal !== '-' ? rackVal : null;

            if (!assyNo16 || !oeNo) continue;

            const part = await this.prisma.partDatabase2r.findFirst({
              where: { assyNo16, oeNo },
            });

            if (part) {
              const existingStock = await this.prisma.stock.findFirst({
                where: { part2rId: part.id },
              });

              const qtyBefore = existingStock?.totalStock || 0;
              const newQty = Math.max(0, isNaN(totalStock) ? 0 : totalStock);
              const qtyChange = newQty - qtyBefore;

              if (existingStock) {
                await this.prisma.stock.update({
                  where: { id: existingStock.id },
                  data: { totalStock: newQty, ...(rack !== null ? { rack } : {}) },
                });
              } else {
                await this.prisma.stock.create({
                  data: { part2rId: part.id, totalStock: newQty, rack },
                });
              }

              if (qtyChange !== 0) {
                await this.prisma.stockTransaction.create({
                  data: {
                    part2rId: part.id,
                    part4rId: null,
                    type: 'ADJUSTMENT',
                    qtyBefore,
                    qtyChange,
                    qtyAfter: newQty,
                    pic: 'SO Excel Adjustment',
                    reference: 'SO-ADJUST-2R',
                    description: `Penyesuaian SO stok 2R (Assy: ${assyNo16}, OE: ${oeNo}) dari ${qtyBefore} ke ${newQty}`,
                  },
                });
              }
              updated2r++;
            }
          }
        } else if (is4R) {
          // Sheet teridentifikasi sebagai 4R
          const rows = worksheet.getRows(3, worksheet.rowCount) || [];
          for (const row of rows) {
            const segment = row.getCell(3).value?.toString()?.trim();
            const assyNo16 = row.getCell(4).value?.toString()?.trim();
            const oeNo = row.getCell(5).value?.toString()?.trim();
            const stockVal = row.getCell(8).value;
            const totalStock = parseInt(stockVal?.toString() || '0', 10);
            const rackVal = row.getCell(9).value?.toString()?.trim();
            const rack = rackVal && rackVal !== '-' ? rackVal : null;

            if (!assyNo16 || !oeNo) continue;

            const whereClause = { assyNo16, oeNo };
            if (segment && segment !== '-') {
              whereClause['segment'] = segment;
            }

            const part = await this.prisma.partDatabase4r.findFirst({
              where: whereClause,
            });

            if (part) {
              const existingStock = await this.prisma.stock.findFirst({
                where: { part4rId: part.id },
              });

              const qtyBefore = existingStock?.totalStock || 0;
              const newQty = Math.max(0, isNaN(totalStock) ? 0 : totalStock);
              const qtyChange = newQty - qtyBefore;

              if (existingStock) {
                await this.prisma.stock.update({
                  where: { id: existingStock.id },
                  data: { totalStock: newQty, ...(rack !== null ? { rack } : {}) },
                });
              } else {
                await this.prisma.stock.create({
                  data: { part4rId: part.id, totalStock: newQty, rack },
                });
              }

              if (qtyChange !== 0) {
                await this.prisma.stockTransaction.create({
                  data: {
                    part2rId: null,
                    part4rId: part.id,
                    type: 'ADJUSTMENT',
                    qtyBefore,
                    qtyChange,
                    qtyAfter: newQty,
                    pic: 'SO Excel Adjustment',
                    reference: 'SO-ADJUST-4R',
                    description: `Penyesuaian SO stok 4R (Assy: ${assyNo16}, OE: ${oeNo}) dari ${qtyBefore} ke ${newQty}`,
                  },
                });
              }
              updated4r++;
            }
          }
        }
      }

      const totalUpdated = updated2r + updated4r;
      return {
        success: true,
        message: `Berhasil menyesuaikan ${totalUpdated} stok di database (${updated2r} item 2R dan ${updated4r} item 4R).`,
        count2r: updated2r,
        count4r: updated4r,
        totalUpdated,
      };
    } catch (error: any) {
      this.logger.error(`Gagal upload adjust stock: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Gagal upload dan adjust stock: ' + error.message);
    }
  }
}
