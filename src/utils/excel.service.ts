import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcelService {
  async readExcel(file: Express.Multer.File): Promise<any[]> {
    try {
      const workbook = XLSX.read(file.buffer, {
        type: 'buffer',
        cellDates: true,
      });

      const sheet =
        workbook.Sheets['Incoming'] || workbook.Sheets[workbook.SheetNames[3]];

      if (!sheet) {
        throw new Error("Sheet 'incoming' tidak ditemukan di file Excel");
      }

      return XLSX.utils.sheet_to_json(sheet);
    } catch (error) {
      throw new Error('Gagal membaca file Excel: ' + (error as Error).message);
    }
  }
}
