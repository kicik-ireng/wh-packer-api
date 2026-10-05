import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async findStock2r() {
    const parts = await this.prisma.partDatabase2r.findMany();
    const stocks = await this.prisma.stock.findMany({
      where: { part2rId: { not: null } },
    });

    return parts.map((part) => {
      const matchingStocks = stocks.filter((s) => s.part2rId === part.id);

      const totalStock = matchingStocks.reduce((sum, stock) => {
        // Sesuaikan field quantity dengan struktur database Anda
        return sum + (stock.totalStock || 0);
      }, 0);

      const stock = stocks.find((s) => s.part2rId === part.id);

      return {
        part2r: part,
        totalStock, // Sekarang diambil dari tabel stock
        rack: stock?.rack ?? null,
      };
    });
  }

  async findStock4r() {
    const parts = await this.prisma.partDatabase4r.findMany({});
    const stocks = await this.prisma.stock.findMany({
      where: { part4rId: { not: null } },
    });

    return parts.map((part) => {
      const matchingStocks = stocks.filter((s) => s.part4rId === part.id);

      const totalStock = matchingStocks.reduce((sum, stock) => {
        // Sesuaikan field quantity dengan struktur database Anda
        return sum + (stock.totalStock || 0);
      }, 0);

      const stock = stocks.find((s) => s.part4rId === part.id);

      return {
        part4r: part,
        totalStock, // Sekarang diambil dari tabel stock
        rack: stock?.rack ?? null,
      };
    });
  }

  async updateRack(partId: number, rack: string, type: '2r' | '4r') {
    const whereClause =
      type === '2r' ? { part2rId: partId } : { part4rId: partId };

    const existing = await this.prisma.stock.findFirst({ where: whereClause });

    if (existing) {
      return this.prisma.stock.update({
        where: { id: existing.id },
        data: { rack },
      });
    } else {
      return this.prisma.stock.create({
        data: {
          rack,
          ...(type === '2r' ? { part2rId: partId } : { part4rId: partId }),
          totalStock: 0,
        },
      });
    }
  }

  async updateStockPerPart2R(partId: number, newQty: number) {
    if (newQty < 0) throw new BadRequestException('Stock tidak boleh negatif');

    const existing = await this.prisma.stock.findFirst({
      where: { part2rId: partId },
    });

    if (existing) {
      return this.prisma.stock.update({
        where: { id: existing.id },
        data: { totalStock: newQty },
      });
    } else {
      return this.prisma.stock.create({
        data: { part2rId: partId, totalStock: newQty },
      });
    }
  }

  async updateStockPerPart4R(partId: number, newQty: number) {
    if (newQty < 0) throw new BadRequestException('Stock tidak boleh negatif');

    const existing = await this.prisma.stock.findFirst({
      where: { part4rId: partId },
    });

    if (existing) {
      return this.prisma.stock.update({
        where: { id: existing.id },
        data: { totalStock: newQty },
      });
    } else {
      return this.prisma.stock.create({
        data: { part4rId: partId, totalStock: newQty },
      });
    }
  }

  // Ekspor 2R
  async exportStock2rToExcel(response: Response) {
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
  }

  // Ekspor 4R
  async exportStock4rToExcel(response: Response) {
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

    // Filter per kolom
    sheet.autoFilter = {
      from: { row: 2, column: 1 },
      to: { row: 2, column: headerLength },
    };

    // Auto width per kolom
    sheet.columns.forEach((column) => {
      let maxLength = 12;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const len = cell.value?.toString().length || 0;
        if (len > maxLength) maxLength = len;
      });
      column.width = maxLength + 2;
    });

    // Tambahkan border tiap data
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
}
