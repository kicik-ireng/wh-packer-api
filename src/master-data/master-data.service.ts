import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Response } from 'express';
import * as ExcelJS from 'exceljs';
import type { VuteqUser } from '@vuteq/sso-client-nest';

@Injectable()
export class MasterDataService {
  private readonly logger = new Logger(MasterDataService.name);

  constructor(private readonly prisma: PrismaService) {}

  private formatDate(date: Date | string | null | undefined): string {
    if (!date) return '-';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '-';
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    } catch {
      return '-';
    }
  }

  private styleSheet(
    sheet: ExcelJS.Worksheet,
    headerRowNumber: number,
    headerLength: number,
    headerBgColor = 'FFDCE6F1',
  ) {
    const headerRow = sheet.getRow(headerRowNumber);
    headerRow.font = { bold: true, color: { argb: 'FF1F2937' }, size: 10 };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 24;

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: headerBgColor },
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF9CA3AF' } },
        bottom: { style: 'medium', color: { argb: 'FF4B5563' } },
        left: { style: 'thin', color: { argb: 'FF9CA3AF' } },
        right: { style: 'thin', color: { argb: 'FF9CA3AF' } },
      };
    });

    sheet.autoFilter = {
      from: { row: headerRowNumber, column: 1 },
      to: { row: headerRowNumber, column: headerLength },
    };

    sheet.columns.forEach((column) => {
      let maxLength = 12;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const val = cell.value ? String(cell.value) : '';
        if (val.length > maxLength) maxLength = val.length;
      });
      column.width = Math.min(Math.max(maxLength + 3, 12), 45);
    });

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > headerRowNumber) {
        row.height = 20;
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          };
        });
      }
    });
  }

  async exportAllMasterDataToExcel(response: Response, user?: VuteqUser) {
    try {
      this.logger.log('Memulai penarikan seluruh Master Data DB untuk export Excel...');

      // 1. Tarik seluruh data Master Data secara paralel dari database
      const [
        dataPart2r,
        dataPart4r,
        dataCustomer,
        dataManpower,
        dataDriver,
        dataTruck,
        dataUsers,
      ] = await Promise.all([
        this.prisma.partDatabase2r.findMany({ orderBy: { id: 'asc' } }),
        this.prisma.partDatabase4r.findMany({ orderBy: { id: 'asc' } }),
        this.prisma.customer.findMany({ orderBy: { id: 'asc' } }),
        this.prisma.manpower.findMany({ orderBy: { id: 'asc' } }),
        this.prisma.driver.findMany({ orderBy: { id: 'asc' } }),
        this.prisma.truck.findMany({ orderBy: { id: 'asc' } }),
        this.prisma.appUser.findMany({
          include: { Role: true },
          orderBy: { CreatedAt: 'asc' },
        }),
      ]);

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Warehouse Packer System';
      workbook.lastModifiedBy = user?.name || user?.username || 'Super Admin';
      workbook.created = new Date();
      workbook.modified = new Date();

      const exportTimestamp = this.formatDate(new Date());
      const exportedBy = user?.name || user?.username || 'Super Administrator';

      // ============================================================
      // SHEET 1: RINGKASAN MASTER DATA (OVERVIEW)
      // ============================================================
      const sheetOverview = workbook.addWorksheet('Ringkasan', {
        views: [{ showGridLines: true }],
      });

      sheetOverview.mergeCells('A1:E1');
      sheetOverview.getCell('A1').value = 'WAREHOUSE PACKER SYSTEM - MASTER DATA REPOSITORY';
      sheetOverview.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
      sheetOverview.getCell('A1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' },
      };
      sheetOverview.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      sheetOverview.getRow(1).height = 36;

      sheetOverview.mergeCells('A2:E2');
      sheetOverview.getCell('A2').value = `Diekspor Oleh: ${exportedBy} | Waktu Ekspor: ${exportTimestamp} | Tingkat Akses: Super Administrator`;
      sheetOverview.getCell('A2').font = { italic: true, size: 10, color: { argb: 'FF374151' } };
      sheetOverview.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      sheetOverview.getRow(2).height = 22;

      sheetOverview.addRow([]); // Blank row at row 3

      const overviewHeader = [
        'NO',
        'KATEGORI MASTER DATA',
        'NAMA SHEET',
        'JUMLAH RECORD',
        'KETERANGAN / DESKRIPSI',
      ];
      sheetOverview.addRow(overviewHeader); // Row 4
      sheetOverview.getRow(4).height = 24;

      const overviewRows = [
        [1, 'Part Database 2R', 'Part 2R', dataPart2r.length, 'Master part komponen 2 Wheeler (Assy 16, OE No, Model)'],
        [2, 'Part Database 4R', 'Part 4R', dataPart4r.length, 'Master part komponen 4 Wheeler (Assy 16, OE No, Model, KPP NP)'],
        [3, 'Data Customer', 'Customer', dataCustomer.length, 'Master pelanggan penerima pengiriman finished goods'],
        [4, 'Data Manpower', 'Manpower', dataManpower.length, 'Master operator / PIC packing & receiving'],
        [5, 'Data Driver', 'Driver', dataDriver.length, 'Master driver ekspedisi pengiriman'],
        [6, 'Data Truck Ekspedisi', 'Truck', dataTruck.length, 'Master armada truck delivery (No Polisi & Warna)'],
        [7, 'User Accounts SSO', 'User Accounts', dataUsers.length, 'Master akun pengguna dan penugasan role sistem'],
      ];

      overviewRows.forEach((r) => sheetOverview.addRow(r));
      this.styleSheet(sheetOverview, 4, overviewHeader.length, 'FFDBEAFE');

      // Total record footer row on overview
      const totalRecords =
        dataPart2r.length +
        dataPart4r.length +
        dataCustomer.length +
        dataManpower.length +
        dataDriver.length +
        dataTruck.length +
        dataUsers.length;

      const summaryTotalRow = sheetOverview.addRow([
        'TOTAL',
        'Seluruh Master Data',
        '7 Sheet Data',
        totalRecords,
        'Database WH-PACKER',
      ]);
      summaryTotalRow.font = { bold: true };
      summaryTotalRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF3F4F6' },
        };
        cell.border = {
          top: { style: 'medium', color: { argb: 'FF1F2937' } },
          bottom: { style: 'double', color: { argb: 'FF1F2937' } },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // ============================================================
      // SHEET 2: PART 2R
      // ============================================================
      const sheet2r = workbook.addWorksheet('Part 2R');
      sheet2r.mergeCells('A1:K1');
      sheet2r.getCell('A1').value = '# MASTER DATA - PART DATABASE 2 WHEELER (2R)';
      sheet2r.getCell('A1').font = { bold: true, size: 12, color: { argb: 'FF1E3A8A' } };
      sheet2r.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };
      sheet2r.getRow(1).height = 28;

      const header2r = [
        'NO',
        'Code No',
        'Customer',
        'Segment',
        'Assy No 16',
        'Assy No 10',
        'OE. No',
        'Model',
        'EMI Part Name',
        'KPP',
        'Dibuat Pada',
      ];
      sheet2r.addRow(header2r);

      dataPart2r.forEach((item, idx) => {
        sheet2r.addRow([
          idx + 1,
          item.codeNo || '-',
          item.customer || '-',
          item.segment || '-',
          item.assyNo16 || '-',
          item.assyNo10 || '-',
          item.oeNo || '-',
          item.model || '-',
          item.emiPartName || '-',
          item.kpp || '-',
          this.formatDate(item.createdAt),
        ]);
      });
      this.styleSheet(sheet2r, 2, header2r.length, 'FFDCE6F1');

      // ============================================================
      // SHEET 3: PART 4R
      // ============================================================
      const sheet4r = workbook.addWorksheet('Part 4R');
      sheet4r.mergeCells('A1:L1');
      sheet4r.getCell('A1').value = '# MASTER DATA - PART DATABASE 4 WHEELER (4R)';
      sheet4r.getCell('A1').font = { bold: true, size: 12, color: { argb: 'FF1E3A8A' } };
      sheet4r.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };
      sheet4r.getRow(1).height = 28;

      const header4r = [
        'NO',
        'Code No',
        'Customer',
        'Segment',
        'Assy No 16',
        'Assy No 10',
        'OE. No',
        'Model',
        'KPP',
        'KPP NP',
        'Dibuat Pada',
      ];
      sheet4r.addRow(header4r);

      dataPart4r.forEach((item, idx) => {
        sheet4r.addRow([
          idx + 1,
          item.codeNo || '-',
          item.customer || '-',
          item.segment || '-',
          item.assyNo16 || '-',
          item.assyNo10 || '-',
          item.oeNo || '-',
          item.model || '-',
          item.kpp || '-',
          item.kppNp || '-',
          this.formatDate(item.createdAt),
        ]);
      });
      this.styleSheet(sheet4r, 2, header4r.length, 'FFDCE6F1');

      // ============================================================
      // SHEET 4: CUSTOMER
      // ============================================================
      const sheetCust = workbook.addWorksheet('Customer');
      sheetCust.mergeCells('A1:E1');
      sheetCust.getCell('A1').value = '# MASTER DATA - CUSTOMER';
      sheetCust.getCell('A1').font = { bold: true, size: 12, color: { argb: 'FF166534' } };
      sheetCust.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };
      sheetCust.getRow(1).height = 28;

      const headerCust = ['NO', 'ID Customer', 'Nama Customer', 'Alamat', 'Dibuat Pada'];
      sheetCust.addRow(headerCust);

      dataCustomer.forEach((item, idx) => {
        sheetCust.addRow([
          idx + 1,
          item.id,
          item.name || '-',
          item.address || '-',
          this.formatDate(item.createdAt),
        ]);
      });
      this.styleSheet(sheetCust, 2, headerCust.length, 'FFE2EFDA');

      // ============================================================
      // SHEET 5: MANPOWER
      // ============================================================
      const sheetMp = workbook.addWorksheet('Manpower');
      sheetMp.mergeCells('A1:D1');
      sheetMp.getCell('A1').value = '# MASTER DATA - MANPOWER (OPERATOR PACKING & RECEIVING)';
      sheetMp.getCell('A1').font = { bold: true, size: 12, color: { argb: 'FF854D0E' } };
      sheetMp.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };
      sheetMp.getRow(1).height = 28;

      const headerMp = ['NO', 'ID Manpower', 'NIK', 'Nama Lengkap'];
      sheetMp.addRow(headerMp);

      dataManpower.forEach((item, idx) => {
        sheetMp.addRow([idx + 1, item.id, item.nik || '-', item.name || '-']);
      });
      this.styleSheet(sheetMp, 2, headerMp.length, 'FFFFF2CC');

      // ============================================================
      // SHEET 6: DRIVER
      // ============================================================
      const sheetDriver = workbook.addWorksheet('Driver');
      sheetDriver.mergeCells('A1:C1');
      sheetDriver.getCell('A1').value = '# MASTER DATA - DRIVER EKSPEDISI';
      sheetDriver.getCell('A1').font = { bold: true, size: 12, color: { argb: 'FF9A3412' } };
      sheetDriver.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };
      sheetDriver.getRow(1).height = 28;

      const headerDriver = ['NO', 'ID Driver', 'Nama Driver'];
      sheetDriver.addRow(headerDriver);

      dataDriver.forEach((item, idx) => {
        sheetDriver.addRow([idx + 1, item.id, item.name || '-']);
      });
      this.styleSheet(sheetDriver, 2, headerDriver.length, 'FFFCE4D6');

      // ============================================================
      // SHEET 7: TRUCK
      // ============================================================
      const sheetTruck = workbook.addWorksheet('Truck');
      sheetTruck.mergeCells('A1:F1');
      sheetTruck.getCell('A1').value = '# MASTER DATA - ARMADA TRUCK DELIVERY';
      sheetTruck.getCell('A1').font = { bold: true, size: 12, color: { argb: 'FF581C87' } };
      sheetTruck.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };
      sheetTruck.getRow(1).height = 28;

      const headerTruck = [
        'NO',
        'ID Truck',
        'Nomor Polisi (No Pol)',
        'Warna Truck',
        'Dibuat Pada',
        'Diperbarui Pada',
      ];
      sheetTruck.addRow(headerTruck);

      dataTruck.forEach((item, idx) => {
        sheetTruck.addRow([
          idx + 1,
          item.id,
          item.noPol || '-',
          item.color || '-',
          this.formatDate(item.createdAt),
          this.formatDate(item.updatedAt),
        ]);
      });
      this.styleSheet(sheetTruck, 2, headerTruck.length, 'FFEDEDF5');

      // ============================================================
      // SHEET 8: USER ACCOUNTS (SSO)
      // ============================================================
      const sheetUsers = workbook.addWorksheet('User Accounts');
      sheetUsers.mergeCells('A1:K1');
      sheetUsers.getCell('A1').value = '# MASTER DATA - USER ACCOUNTS & ROLES CONFIGURATION';
      sheetUsers.getCell('A1').font = { bold: true, size: 12, color: { argb: 'FF374151' } };
      sheetUsers.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };
      sheetUsers.getRow(1).height = 28;

      const headerUsers = [
        'NO',
        'User ID',
        'SSO Object ID',
        'Username',
        'Nama Lengkap',
        'Email',
        'Nomor Telepon',
        'Role Sistem',
        'Status Akun',
        'Terakhir Login',
        'Tanggal Dibuat',
      ];
      sheetUsers.addRow(headerUsers);

      dataUsers.forEach((item, idx) => {
        sheetUsers.addRow([
          idx + 1,
          item.Id,
          item.SsoObjectId,
          item.UserName,
          item.Name,
          item.Email || '-',
          item.PhoneNumber || '-',
          item.Role?.RoleName || 'none',
          item.IsActive ? 'ACTIVE' : 'INACTIVE',
          this.formatDate(item.LastLogin),
          this.formatDate(item.CreatedAt),
        ]);
      });
      this.styleSheet(sheetUsers, 2, headerUsers.length, 'FFE7E6E6');

      // ============================================================
      // KIRIMKAN WORKBOOK KE RESPONSE HTTP STREAM
      // ============================================================
      const filename = `master-data-wh-packer-${new Date().toISOString().slice(0, 10)}.xlsx`;

      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );

      await workbook.xlsx.write(response);
      response.end();

      this.logger.log(`Berhasil mengekspor seluruh Master Data (${totalRecords} record) ke Excel.`);
    } catch (error: any) {
      this.logger.error(`Gagal ekspor Master Data ke Excel: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `Gagal mengekspor seluruh Master Data ke Excel: ${error.message}`,
      );
    }
  }
}
