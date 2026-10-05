import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { MonthlyRekapService } from './monthly-rekap.service';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

@Controller('monthly-rekap')
export class MonthlyRekapController {
  constructor(private readonly monthlyRekapService: MonthlyRekapService) {}

  @Get()
  async getRekap(
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('day') day?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const now = new Date();

    const y = year ? parseInt(year, 10) : now.getFullYear();
    const m = month ? parseInt(month, 10) : now.getMonth() + 1;
    const d = day ? parseInt(day, 10) : undefined;

    return this.monthlyRekapService.getRekap(y, m, d, from, to);
  }

  @Get('export-excel')
  async exportExcel(
    @Res() res: Response,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('day') day?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    if ((!year || !month) && (!from || !to)) {
      throw new BadRequestException(
        'Harus isi minimal (year & month) atau (from & to)',
      );
    }

    const y = year ? parseInt(year, 10) : undefined;
    const m = month ? parseInt(month, 10) : undefined;
    const d = day ? parseInt(day, 10) : undefined;

    const rawData = await this.monthlyRekapService.getRekap(y, m, d, from, to);

    // 🔹 Transformasi data
    const data = rawData.map((row) => ({
      picName: row.name,
      totalPcs: `${row.totalQty.toLocaleString('id-ID')} PCS`,
      totalSalary: `Rp. ${row.totalHarga.toLocaleString('id-ID')}`,
    }));

    // 🔹 Buat workbook & worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rekap');

    // 🔹 Tambah tabel dengan style
    worksheet.addTable({
      name: 'RekapTable',
      ref: 'A1',
      headerRow: true,
      style: {
        theme: 'TableStyleMedium9', // bisa diganti TableStyleLight11, TableStyleDark1, dll.
        showRowStripes: true,
      },
      columns: [
        { name: 'PIC Name', filterButton: true },
        { name: 'Total PCS', filterButton: true },
        { name: 'Total Salary', filterButton: true },
      ],
      rows: data.map((row) => [row.picName, row.totalPcs, row.totalSalary]),
    });

    // 🔹 Auto width kolom
    // 🔹 Auto width kolom setelah addTable
    if (worksheet.columns) {
      worksheet.columns.forEach((col) => {
        let maxLength = 15;
        col.eachCell?.({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
        col.width = maxLength + 2;
      });
    }

    // 🔹 Buffer hasil Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `monthly_rekap_${from ?? y + '-' + m}_to_${to ?? ''}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.end(buffer);
  }
}

// tanpa parameter

//   const y = year ? parseInt(year, 10) : undefined;
//   const m = month ? parseInt(month, 10) : undefined;
//   const d = day ? parseInt(day, 10) : undefined;

//   return this.monthlyRekapService.getRekap(y, m, d, from, to);

// Endpoint: /monthly-rekap?year=2025&month=9

//     const y = parseInt(year, 10);
//     const m = parseInt(month, 10);

//       throw new Error('Year and month must be valid numbers');

//     return this.monthlyRekapService.getMonthlyRekap(y, m);

// otomatis

//     const now = new Date();

//     const y = year ? parseInt(year, 10) : now.getFullYear();
//     const m = month ? parseInt(month, 10) : now.getMonth() + 1; // bulan dari 1-12

//     return this.monthlyRekapService.getMonthlyRekap(y, m);
