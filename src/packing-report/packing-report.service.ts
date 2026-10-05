//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from "@nestjs/common";

//       tanggalPacking,
//       lineNo,
//       keterangan,
//       qty2R = 0,
//       qty4R = 0,
//       pic1Id,
//       pic2Id,
//       pic3Id,
//       entries,
//     } = dto;

//     const tanggal = new Date(tanggalPacking);

//       no: d.no,
//       jamMulai: d.jamMulai,
//       jamSelesai: d.jamSelesai,
//       menitPacking: d.menitPacking,
//       packingReqNo: d.packingReqNo,
//       explannerNo: d.explannerNo,
//       customerPartNo: d.customerPartNo,
//       qtyPlan: d.qtyPlan,
//       qtyActualPacking: parseInt(d.qtyActualPacking?.toString() ?? "0"),
//       balancePlanVsActual: d.balancePlanVsActual,
//       type: d.type,
//       Incoming2rId: d.type === "2R" ? parseInt(d.packingReqNo) : null,
//       Incoming4rId: d.type === "4R" ? parseInt(d.packingReqNo) : null,
//     }));

//     //     tanggalPacking: tanggal,
//     //     lineNo: lineNo,
//     //   },
//     // });

//     //     ...entry,
//     //     packingReportId: existingReport.id,
//     //   }));

//     //   await this.prisma.$transaction([
//     //     // 1. Update PIC

//     //       where: { id: existingReport.id },

//     //           pic1: pic1Id ? { connect: { id: pic1Id } } : { disconnect: true },
//     //         }),

//     //           pic2: pic2Id ? { connect: { id: pic2Id } } : { disconnect: true },
//     //         }),

//     //           pic3: pic3Id ? { connect: { id: pic3Id } } : { disconnect: true },
//     //         }),
//     //       },
//     //     }),

//     //     // 2. Tambah entry baru
//     //     ...newEntries.map((entry) =>
//     //       this.prisma.packingEntry.create({ data: entry })
//     //     ),

//     //     // 3. Tambah qty actual

//     //       const id = parseInt(entry.packingReqNo);
//     //       const qty = entry.qtyActualPacking;
//     //       return entry.type === "4R"

//     //             where: { id },
//     //             data: { qtyActual: { increment: qty } },
//     //           })

//     //             where: { id },
//     //             data: { qtyActual: { increment: qty } },
//     //           });
//     //     }),
//     //   ]);

//     //   return true;

//         tanggalPacking: tanggal,
//         lineNo,
//         keterangan,
//         qty2R: parseInt(qty2R.toString()),
//         qty4R: parseInt(qty4R.toString()),
//         pic1: pic1Id ? { connect: { id: pic1Id } } : undefined,
//         pic2: pic2Id ? { connect: { id: pic2Id } } : undefined,
//         pic3: pic3Id ? { connect: { id: pic3Id } } : undefined,

//           create: formattedEntries,
//         },
//       },
//     });

//         pic1: true,
//         pic2: true,
//         pic3: true,

//             Incoming2r: true,
//             Incoming4r: true,
//             pic1: true,
//             pic2: true,
//             pic3: true,
//           },
//         },
//       },

//         tanggalPacking: "desc",
//       },
//     });

//       where: { id },

//         pic1: true,
//         pic2: true,
//         pic3: true,
//         entries: true,
//       },
//     });
//     if (!report) throw new NotFoundException("PackingReport not found");
//     return report;

//     return this.findOne(id);

//       tanggalPacking,
//       lineNo,
//       keterangan,
//       qty4R,
//       qty2R,
//       pic1Id,
//       pic2Id,
//       pic3Id,
//       entries,
//     } = updateDto;

//     console.log(updateDto);

//       where: { id },

//         ...(tanggalPacking && { tanggalPacking: new Date(tanggalPacking) }),
//         ...(lineNo && { lineNo }),
//         ...(keterangan && { keterangan }),
//         ...(qty4R !== undefined && { qty4R: parseInt(qty4R ?? "0") }),
//         ...(qty2R !== undefined && { qty2R: parseInt(qty2R ?? "0") }),

//           pic1: pic1Id ? { connect: { id: pic1Id } } : { disconnect: true },
//         }),

//           pic2: pic2Id ? { connect: { id: pic2Id } } : { disconnect: true },
//         }),

//           pic3: pic3Id ? { connect: { id: pic3Id } } : { disconnect: true },
//         }),
//       },

//         pic1: true,
//         pic2: true,
//         pic3: true,
//         entries: true,
//       },
//     });

//       where: { id },

//         pic1: true,
//         pic2: true,
//         pic3: true,
//         entries: true,
//       },
//     });

//       throw new NotFoundException(
//         `PackingReport dengan ID ${id} tidak ditemukan.`
//       );

//     // Validation Approve

//       throw new BadRequestException(
//         `PackingReport dengan ID ${id} tidak bisa di-approve karena statusnya bukan Pending.`
//       );

//     // Validation Qty
//     const qtyMismatch = report.entries.some(
//       (entry) => entry.qtyActualPacking !== entry.qtyPlan
//     );

//       throw new BadRequestException(
//         `Tidak bisa di-approve karena terdapat entry dengan qtyActual ≠ qtyPlan.`
//       );

//     // Update status

//       where: { id },

//         status: updateDto.status,
//       },

//         pic1: true,
//         pic2: true,
//         pic3: true,
//         entries: true,
//       },
//     });

//     // Get All Incoming
//     const incoming2rIds = Array.from(
//       new Set(
//         updatedReport.entries
//           .map((entry) => entry.Incoming2rId)
//           .filter((id) => id !== null) as number[]
//       )
//     );

//     const incoming4rIds = Array.from(
//       new Set(
//         updatedReport.entries
//           .map((entry) => entry.Incoming4rId)
//           .filter((id) => id !== null) as number[]
//       )
//     );

//     // Update Status Incoming

//       incoming2rIds.map((id) =>

//           where: { id },
//           data: { status: updateDto.status },
//         })
//       )
//     );

//       incoming4rIds.map((id) =>

//           where: { id },
//           data: { status: updateDto.status },
//         })
//       )
//     );

//     return updatedReport;

//     return this.prisma.packingReport.delete({ where: { id } });

//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet("Packing Report");

//     // Header Merging
//     sheet.mergeCells("A1:A2");
//     sheet.mergeCells("B1:D1");
//     sheet.mergeCells("E1:G1");
//     sheet.mergeCells("H1:H2");
//     sheet.mergeCells("I1:I2");
//     sheet.mergeCells("J1:J2");
//     sheet.mergeCells("K1:M1");
//     sheet.mergeCells("N1:N2");
//     sheet.mergeCells("O1:O2");

//     // Header Content
//     sheet.getRow(1).values = [
//       "No",
//       "Jam",
//       null,
//       null,
//       "PIC",
//       null,
//       null,
//       "Packing Req No",
//       "Explanner No",
//       "Cust Part No",
//       "Qty",
//       null,
//       null,
//       "Type",
//       "Keterangan",
//     ];

//     sheet.getRow(2).values = [
//       null,
//       "Mulai",
//       "Selesai",
//       "Menit",
//       "1",
//       "2",
//       "3",
//       null,
//       null,
//       null,
//       "Plan",
//       "Actual",
//       "∆",
//       null,
//       null,
//     ];

//     // Header Styling

//       const row = sheet.getRow(i);
//       row.height = 20;

//         cell.font = { bold: true };
//         cell.alignment = { horizontal: "center", vertical: "middle" };

//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "FFEFEFEF" },
//         };

//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" },
//         };
//       });

//     // Column Widths
//     sheet.columns = [
//       { width: 5 },
//       { width: 10 },
//       { width: 10 },
//       { width: 8 },
//       { width: 15 },
//       { width: 15 },
//       { width: 15 },
//       { width: 15 },
//       { width: 15 },
//       { width: 15 },
//       { width: 10 },
//       { width: 10 },
//       { width: 10 },
//       { width: 8 },
//       { width: 25 },
//     ];

//     sheet.views = [{ state: "frozen", ySplit: 2 }];

//     // Data Rows

//       const row = sheet.addRow([
//         index + 1,
//         entry.jamMulai ?? "-",
//         entry.jamSelesai ?? "-",
//         entry.menitPacking ?? "-",
//         report.pic1?.name ?? "-",
//         report.pic2?.name ?? "-",
//         report.pic3?.name ?? "-",
//         entry.packingReqNo ?? "-",
//         entry.explannerNo ?? "-",
//         entry.customerPartNo ?? "-",
//         entry.qtyPlan ?? "-",
//         entry.qtyActualPacking ?? "-",
//         entry.balancePlanVsActual ?? "-",
//         entry.type ?? "-",
//         report.keterangan ?? "-",
//       ]);

//         cell.alignment = { vertical: "middle", horizontal: "center" };

//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" },
//         };
//       });

//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: "FFF9F9F9" },
//           };
//         });

//     });
//     // Calculate Qty
//     const totalActual = report.entries.reduce(
//       (sum, entry) => sum + (entry.qtyActualPacking ?? 0),
//       0
//     );
//     // Footer
//     const footerRow = sheet.addRow([
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       "",
//       `∆: ${totalActual ?? "-"}`,
//       `2R: ${report.qty2R ?? "-"}`,
//       `4R: ${report.qty4R ?? "-"}`,
//       "",
//       "",
//     ]);

//         cell.font = { bold: true };
//         cell.alignment = { horizontal: "center", vertical: "middle" };

//         top: { style: "thin" },
//         left: { style: "thin" },
//         bottom: { style: "thin" },
//         right: { style: "thin" },
//       };
//     });

//     // Return Buffer
//     const buffer = await workbook.xlsx.writeBuffer();
//     return Buffer.from(buffer);

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreatePackingReportDto } from './dto/create-packing-report.dto';
import { UpdatePackingReportDto } from './dto/update-packing-report.dto';
import * as ExcelJS from 'exceljs';
import { Status } from '@prisma/client';
import { PackingReportGateway } from './packing-report.gateway';

@Injectable()
export class PackingReportService {
  constructor(private prisma: PrismaService) {}

  //     tanggalPacking,
  //     lineNo,
  //     keterangan,
  //     qty2R = 0,
  //     qty4R = 0,
  //     pic1Id,
  //     pic2Id,
  //     pic3Id,
  //     entries,
  //   } = dto;

  //   const tanggal = new Date(tanggalPacking);

  //     no: d.no,
  //     jamMulai: d.jamMulai,
  //     jamSelesai: d.jamSelesai,
  //     menitPacking: d.menitPacking,
  //     packingReqNo: d.packingReqNo,
  //     explannerNo: d.explannerNo,
  //     customerPartNo: d.customerPartNo,
  //     qtyPlan: d.qtyPlan,
  //     qtyActualPacking: parseInt(d.qtyActualPacking?.toString() ?? "0"),
  //     balancePlanVsActual: d.balancePlanVsActual,
  //     type: d.type,
  //     Incoming2rId: d.type === "2R" ? parseInt(d.packingReqNo) : null,
  //     Incoming4rId: d.type === "4R" ? parseInt(d.packingReqNo) : null,
  //   }));

  //       tanggalPacking: tanggal,
  //       lineNo,
  //       keterangan,
  //       qty2R: parseInt(qty2R.toString()),
  //       qty4R: parseInt(qty4R.toString()),
  //       pic1: pic1Id ? { connect: { id: pic1Id } } : undefined,
  //       pic2: pic2Id ? { connect: { id: pic2Id } } : undefined,
  //       pic3: pic3Id ? { connect: { id: pic3Id } } : undefined,

  //         create: formattedEntries,
  //       },
  //     },
  //   });

  //   return entry;

  //     tanggalPacking: tanggal,
  //     lineNo: lineNo,
  //   },
  // });

  //     ...entry,
  //     packingReportId: existingReport.id,
  //   }));

  //     // 1. Update PIC

  //       where: { id: existingReport.id },

  //           pic1: pic1Id ? { connect: { id: pic1Id } } : { disconnect: true },
  //         }),

  //           pic2: pic2Id ? { connect: { id: pic2Id } } : { disconnect: true },
  //         }),

  //           pic3: pic3Id ? { connect: { id: pic3Id } } : { disconnect: true },
  //         }),
  //       },
  //     }),

  //     // 2. Tambah entry baru
  //     ...newEntries.map((entry) =>
  //       this.prisma.packingEntry.create({ data: entry })
  //     ),

  //     // 3. Tambah qty actual

  //       const id = parseInt(entry.packingReqNo);
  //       const qty = entry.qtyActualPacking;
  //       return entry.type === "4R"

  //             where: { id },
  //             data: { qtyActual: { increment: qty } },
  //           })

  //             where: { id },
  //             data: { qtyActual: { increment: qty } },
  //           });
  //     }),
  //   ]);

  //   return true;

  //   tanggalPacking: Date;
  //   lineNo: string;
  //   keterangan: string | null;
  //   qty4R: number | null;
  //   qty2R: number | null;
  //   status: Status;
  //   createdAt: Date;
  //   updatedAt: Date;
  //   id: number;
  //   pic1Id: number | null;
  //   pic2Id: number | null;
  //   pic3Id: number | null;

  //           packingReportId: entry.id,
  //           type: '4R',
  //         },

  //           Incoming4r: true,
  //         },
  //       });
  //       if (!entriPE) throw new BadRequestException('Entry not found');

  //           assyNo16: entriPE.Incoming4r?.assyNo16,
  //           assyNo10: entriPE.Incoming4r?.assyNo10,
  //           oeNo: entriPE.Incoming4r?.oeNo,
  //         },
  //       });

  //           part4rId: part?.id,
  //           part2rId: null,
  //         },
  //       });

  //         console.log(existingStock);

  //           where: { id: existingStock.id },

  //               increment: entriPE.qtyActualPacking,
  //             },
  //             updatedAt: new Date(),
  //           },
  //         });

  //             part4rId: entriPE.part4rId,
  //             part2rId: null,
  //             totalStock: entriPE.qtyActualPacking,
  //             rack: null,
  //           },
  //         });

  //           packingReportId: entry.id,
  //           type: '2R',
  //         },

  //           Incoming2r: true,
  //         },
  //       });
  //       if (!entriPE) throw new BadRequestException('Entry not found');

  //           assyNo16: entriPE.Incoming2r?.assyNo16,
  //           assyNo10: entriPE.Incoming2r?.assyNo10,
  //           oeNo: entriPE.Incoming2r?.oeNo,
  //         },
  //       });

  //           part2rId: part?.id,
  //           part4rId: null,
  //         },
  //       });

  //           where: { id: existingStock.id },

  //               increment: entriPE.qtyActualPacking,
  //             },
  //             updatedAt: new Date(),
  //           },
  //         });

  //             part2rId: entriPE.part4rId,
  //             part4rId: null,
  //             totalStock: entriPE.qtyActualPacking,
  //             rack: null,
  //           },
  //         });

  //     console.error('Error updating stock:', error);
  //     throw new Error('Failed to update stock records');

  //     tanggalPacking,
  //     lineNo,
  //     keterangan,
  //     qty2R = 0,
  //     qty4R = 0,
  //     pic1Id,
  //     pic2Id,
  //     pic3Id,
  //     entries,
  //   } = dto;

  //   const tanggal = new Date(tanggalPacking);

  //   // ✅ Validasi total kumulatif per packingReqNo

  //     const planQty = entry.qtyPlan;
  //     console.log("Validating entry:", planQty);
  //     console.log("Entry details:", entry.packingReqNo);

  //     // Total existing dari DB untuk packingReqNo yang sama

  //       _sum: { qtyActualPacking: true },
  //       where: { packingReqNo: entry.packingReqNo },
  //     });

  //     console.log("Existing total for packingReqNo:", existingTotal._sum.qtyActualPacking);

  //     const totalAfterInput =
  //       (existingTotal._sum.qtyActualPacking ?? 0) +
  //       (parseInt(entry.qtyActualPacking?.toString() ?? "0"));

  //       throw new BadRequestException(
  //         `❌ PR ${entry.packingReqNo}: total input (${totalAfterInput}) melebihi plan (${planQty}). Input ditolak.`
  //       );

  //     no: d.no,
  //     jamMulai: d.jamMulai,
  //     jamSelesai: d.jamSelesai,
  //     menitPacking: d.menitPacking,
  //     packingReqNo: d.packingReqNo,
  //     explannerNo: d.explannerNo,
  //     customerPartNo: d.customerPartNo,
  //     qtyPlan: d.qtyPlan,
  //     qtyActualPacking: parseInt(d.qtyActualPacking?.toString() ?? "0"),
  //     balancePlanVsActual: d.balancePlanVsActual,
  //     type: d.type,
  //     Incoming2rId: d.type === "2R" ? parseInt(d.packingReqNo) : null,
  //     Incoming4rId: d.type === "4R" ? parseInt(d.packingReqNo) : null,
  //   }));

  //       tanggalPacking: tanggal,
  //       lineNo,
  //       keterangan,
  //       qty2R: parseInt(qty2R.toString()),
  //       qty4R: parseInt(qty4R.toString()),
  //       pic1: pic1Id ? { connect: { id: pic1Id } } : undefined,
  //       pic2: pic2Id ? { connect: { id: pic2Id } } : undefined,
  //       pic3: pic3Id ? { connect: { id: pic3Id } } : undefined,

  //         create: formattedEntries,
  //       },
  //     },
  //   });

  //   return entry;

  async create(dto: CreatePackingReportDto) {
    const {
      tanggalPacking,
      lineNo,
      keterangan,
      qty2R = 0,
      qty4R = 0,
      pic1Id,
      pic2Id,
      pic3Id,
      entries,
    } = dto;

    const tanggal = new Date(tanggalPacking);

    for (const d of entries) {
      const qtyActualNew = parseInt(d.qtyActualPacking?.toString() ?? '0');
      const qtyPlan = parseInt(d.qtyPlan?.toString() ?? '0');

      // hitung total actual existing untuk packingReqNo yang sama
      const existing = await this.prisma.packingEntry.aggregate({
        _sum: {
          qtyActualPacking: true,
        },
        where: {
          packingReqNo: d.packingReqNo,
          type: d.type,
        },
      });

      const qtyActualExisting = existing._sum.qtyActualPacking ?? 0;
      const totalActual = qtyActualExisting + qtyActualNew;

      if (totalActual > qtyPlan) {
        throw new BadRequestException(
          `Qty Actual total (${totalActual}) melebihi Qty Plan (${qtyPlan}) untuk ReqNo ${d.packingReqNo}`,
        );
      }
    }

    //   no: d.no,
    //   jamMulai: d.jamMulai,
    //   jamSelesai: d.jamSelesai,
    //   menitPacking: d.menitPacking,
    //   packingReqNo: d.packingReqNo,
    //   explannerNo: d.explannerNo,
    //   customerPartNo: d.customerPartNo,
    //   qtyPlan: d.qtyPlan,
    //   qtyActualPacking: parseInt(d.qtyActualPacking?.toString() ?? "0"),
    //   balancePlanVsActual: d.balancePlanVsActual,
    //   type: d.type,
    //   Incoming2rId: d.type === "2R" ? parseInt(d.packingReqNo) : null,
    //   Incoming4rId: d.type === "4R" ? parseInt(d.packingReqNo) : null,
    // }));

    //   const formattedEntries = [];

    //   const qtyActualNew = parseInt(d.qtyActualPacking?.toString() ?? "0");
    //   const qtyPlan = parseInt(d.qtyPlan?.toString() ?? "0");

    //   // existing actual untuk reqNo yg sama

    //     _sum: { qtyActualPacking: true },
    //     where: { packingReqNo: d.packingReqNo, type: d.type },
    //   });
    //   const qtyActualExisting = existing._sum.qtyActualPacking ?? 0;

    //   const totalActual = qtyActualExisting + qtyActualNew;
    //   const balance = qtyPlan - totalActual;

    //     no: d.no,
    //     jamMulai: d.jamMulai,
    //     jamSelesai: d.jamSelesai,
    //     menitPacking: d.menitPacking,
    //     packingReqNo: d.packingReqNo,
    //     explannerNo: d.explannerNo,
    //     customerPartNo: d.customerPartNo,
    //     qtyPlan: qtyPlan,
    //     qtyActualPacking: qtyActualNew,
    //     balancePlanVsActual: balance,   // ✅ FIXED
    //     type: d.type,
    //     Incoming2rId: d.type === "2R" ? parseInt(d.packingReqNo) : null,
    //     Incoming4rId: d.type === "4R" ? parseInt(d.packingReqNo) : null,
    //   });

    const formattedEntries = [];

    for (const d of entries) {
      const qtyActualNew = parseInt(d.qtyActualPacking?.toString() ?? '0');
      const qtyPlan = parseInt(d.qtyPlan?.toString() ?? '0');

      // 🔥 HITUNG TOTAL ACTUAL SAAT INI (UPDATE REALTIME)
      const actualAgg = await this.prisma.packingEntry.aggregate({
        _sum: { qtyActualPacking: true },
        where: {
          packingReqNo: d.packingReqNo,
          type: d.type,
        },
      });

      const totalActual = actualAgg._sum.qtyActualPacking ?? 0;

      // 🔥 BALANCE = PLAN - TOTAL ACTUAL TERBARU
      const balance = qtyPlan - totalActual;

      formattedEntries.push({
        no: d.no,
        jamMulai: d.jamMulai,
        jamSelesai: d.jamSelesai,
        menitPacking: d.menitPacking,
        packingReqNo: d.packingReqNo,
        explannerNo: d.explannerNo,
        customerPartNo: d.customerPartNo,
        qtyPlan: qtyPlan,
        qtyActualPacking: qtyActualNew,
        balancePlanVsActual: balance,
        type: d.type,
        Incoming2rId: d.type === '2R' ? parseInt(d.packingReqNo) : null,
        Incoming4rId: d.type === '4R' ? parseInt(d.packingReqNo) : null,
      });
    }

    const entry = await this.prisma.packingReport.create({
      data: {
        tanggalPacking: tanggal,
        lineNo,
        keterangan,
        qty2R: parseInt(qty2R.toString()),
        qty4R: parseInt(qty4R.toString()),
        pic1: pic1Id ? { connect: { id: pic1Id } } : undefined,
        pic2: pic2Id ? { connect: { id: pic2Id } } : undefined,
        pic3: pic3Id ? { connect: { id: pic3Id } } : undefined,
        entries: {
          create: formattedEntries,
        },
      },
    });

    await this.updateStock(entry);

    return entry;
  }
  private async updateStock(entry: {
    id: number;
    qty4R: number | null;
    qty2R: number | null;
  }) {
    try {
      // Find all packing entries for this report
      const packingEntries = await this.prisma.packingEntry.findMany({
        where: {
          packingReportId: entry.id,
        },
        include: {
          Incoming4r: true,
          Incoming2r: true,
        },
      });

      // Process each packing entry
      for (const entriPE of packingEntries) {
        if (entriPE.type === '4R') {
          const part = await this.prisma.partDatabase4r.findFirst({
            where: {
              assyNo16: entriPE.Incoming4r?.assyNo16,
              assyNo10: entriPE.Incoming4r?.assyNo10,
              oeNo: entriPE.Incoming4r?.oeNo,
            },
          });

          if (!part) {
            console.warn(`4R Part not found for entry ${entriPE.id}`);
            continue;
          }

          await this.upsertStock({
            part4rId: part.id,
            quantity: entriPE.qtyActualPacking,
            part2rId: null,
          });
        } else if (entriPE.type === '2R') {
          // FIX: Changed from partDatabase4r to partDatabase2r
          const part = await this.prisma.partDatabase2r.findFirst({
            where: {
              assyNo16: entriPE.Incoming2r?.assyNo16,
              assyNo10: entriPE.Incoming2r?.assyNo10,
              oeNo: entriPE.Incoming2r?.oeNo,
              emiPartName: entriPE.Incoming2r?.EMIpartname,
            },
          });

          if (!part) {
            console.warn(`2R Part not found for entry ${entriPE.id}`);
            continue;
          }

          await this.upsertStock({
            part2rId: part.id,
            quantity: entriPE.qtyActualPacking,
            part4rId: null,
          });
        }
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      throw new Error('Failed to update stock records');
    }
  }

  private async upsertStock(params: {
    part4rId?: number | null;
    part2rId?: number | null;
    quantity: number;
  }) {
    const { part4rId, part2rId, quantity } = params;

    const where = {
      part4rId: part4rId || null,
      part2rId: part2rId || null,
    };

    const existingStock = await this.prisma.stock.findFirst({
      where,
    });

    if (existingStock) {
      await this.prisma.stock.update({
        where: { id: existingStock.id },
        data: {
          totalStock: {
            increment: quantity,
          },
          updatedAt: new Date(),
        },
      });
    } else {
      await this.prisma.stock.create({
        data: {
          part4rId,
          part2rId,
          totalStock: quantity,
          rack: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  async findAll(page?: number, limit?: number) {
    if (!page || !limit) {
      return this.prisma.packingReport.findMany({
        take: 500,
        include: {
          pic1: true,
          pic2: true,
          pic3: true,
          entries: {
            include: {
              Incoming2r: true,
              Incoming4r: true,
              pic1: true,
              pic2: true,
              pic3: true,
            },
          },
        },
        orderBy: {
          tanggalPacking: 'desc',
        },
      });
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.packingReport.findMany({
        skip,
        take: limit,
        include: {
          pic1: true,
          pic2: true,
          pic3: true,
          entries: {
            include: {
              Incoming2r: true,
              Incoming4r: true,
              pic1: true,
              pic2: true,
              pic3: true,
            },
          },
        },
        orderBy: {
          tanggalPacking: 'desc',
        },
      }),
      this.prisma.packingReport.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const report = await this.prisma.packingReport.findUnique({
      where: { id },
      include: {
        pic1: true,
        pic2: true,
        pic3: true,
        entries: true,
      },
    });
    if (!report) throw new NotFoundException('PackingReport not found');
    return report;
  }

  async findOneWithEntries(id: number) {
    return this.findOne(id);
  }

  async update(id: number, updateDto: UpdatePackingReportDto) {
    const {
      tanggalPacking,
      lineNo,
      keterangan,
      qty4R,
      qty2R,
      pic1Id,
      pic2Id,
      pic3Id,
      entries,
    } = updateDto;

    //console.log(updateDto);
    return this.prisma.packingReport.update({
      where: { id },
      data: {
        ...(tanggalPacking && { tanggalPacking: new Date(tanggalPacking) }),
        ...(lineNo && { lineNo }),
        ...(keterangan && { keterangan }),
        ...(qty4R !== undefined && { qty4R: parseInt(qty4R ?? '0') }),
        ...(qty2R !== undefined && { qty2R: parseInt(qty2R ?? '0') }),
        ...(pic1Id !== undefined && {
          pic1: pic1Id ? { connect: { id: pic1Id } } : { disconnect: true },
        }),
        ...(pic2Id !== undefined && {
          pic2: pic2Id ? { connect: { id: pic2Id } } : { disconnect: true },
        }),
        ...(pic3Id !== undefined && {
          pic3: pic3Id ? { connect: { id: pic3Id } } : { disconnect: true },
        }),
      },
      include: {
        pic1: true,
        pic2: true,
        pic3: true,
        entries: true,
      },
    });
  }

  async approve(id: number, updateDto: { status: Status }) {
    const report = await this.prisma.packingReport.findUnique({
      where: { id },
      include: {
        pic1: true,
        pic2: true,
        pic3: true,
        entries: true,
      },
    });

    if (!report) {
      throw new NotFoundException(
        `PackingReport dengan ID ${id} tidak ditemukan.`,
      );
    }

    // Validation Approve
    if (report.status !== 'PENDING') {
      throw new BadRequestException(
        `PackingReport dengan ID ${id} tidak bisa di-approve karena statusnya bukan Pending.`,
      );
    }

    // Validation Qty
    const qtyMismatch = report.entries.some(
      (entry) => entry.qtyActualPacking !== entry.qtyPlan,
    );

    if (qtyMismatch) {
      throw new BadRequestException(
        `Tidak bisa di-approve karena terdapat entry dengan qtyActual ≠ qtyPlan.`,
      );
    }

    // Update status
    const updatedReport = await this.prisma.packingReport.update({
      where: { id },
      data: {
        status: updateDto.status,
      },
      include: {
        pic1: true,
        pic2: true,
        pic3: true,
        entries: true,
      },
    });

    // Get All Incoming
    const incoming2rIds = Array.from(
      new Set(
        updatedReport.entries
          .map((entry) => entry.Incoming2rId)
          .filter((id) => id !== null) as number[],
      ),
    );

    const incoming4rIds = Array.from(
      new Set(
        updatedReport.entries
          .map((entry) => entry.Incoming4rId)
          .filter((id) => id !== null) as number[],
      ),
    );

    // Update Status Incoming
    await Promise.all(
      incoming2rIds.map((id) =>
        this.prisma.incoming2r.update({
          where: { id },
          data: { status: updateDto.status },
        }),
      ),
    );

    await Promise.all(
      incoming4rIds.map((id) =>
        this.prisma.incoming4r.update({
          where: { id },
          data: { status: updateDto.status },
        }),
      ),
    );

    return updatedReport;
  }

  //       packingReportId: id,
  //     },

  //       Incoming4r: true,
  //       Incoming2r: true,
  //     },
  //   });

  //     if (!entriPE) throw new BadRequestException('Entry not found');

  //         assyNo16: entriPE.Incoming4r?.assyNo16,
  //         assyNo10: entriPE.Incoming4r?.assyNo10,
  //         oeNo: entriPE.Incoming4r?.oeNo,
  //       },
  //     });

  //         part4rId: part?.id,
  //         part2rId: null,
  //       },
  //     });

  //         where: { id: existingStock.id },

  //             decrement: entriPE.qtyActualPacking,
  //           },
  //           updatedAt: new Date(),
  //         },
  //       });

  //     if (!entriPE) throw new BadRequestException('Entry not found');

  //         assyNo16: entriPE.Incoming2r?.assyNo16,
  //         assyNo10: entriPE.Incoming2r?.assyNo10,
  //         oeNo: entriPE.Incoming2r?.oeNo,
  //       },
  //     });

  //         part2rId: part?.id,
  //         part4rId: null,
  //       },
  //     });

  //         where: { id: existingStock.id },

  //             decrement: entriPE.qtyActualPacking,
  //           },
  //           updatedAt: new Date(),
  //         },
  //       });

  //   return this.prisma.packingReport.delete({ where: { id } });

  async remove(id: number) {
    // First get all packing entries for this report
    const packingEntries = await this.prisma.packingEntry.findMany({
      where: {
        packingReportId: id,
      },
      include: {
        Incoming4r: true,
        Incoming2r: true,
      },
    });

    if (!packingEntries.length) {
      throw new BadRequestException('No packing entries found for this report');
    }

    // Process each entry to update stock
    for (const entry of packingEntries) {
      try {
        if (entry.type === '4R' && entry.Incoming4r) {
          const part = await this.prisma.partDatabase4r.findFirst({
            where: {
              assyNo16: entry.Incoming4r.assyNo16,
              assyNo10: entry.Incoming4r.assyNo10,
              oeNo: entry.Incoming4r.oeNo,
            },
          });

          if (part) {
            await this.adjustStock({
              part4rId: part.id,
              quantity: -entry.qtyActualPacking, // Decrement stock
            });
          }
        } else if (entry.type === '2R' && entry.Incoming2r) {
          const part = await this.prisma.partDatabase2r.findFirst({
            where: {
              assyNo16: entry.Incoming2r.assyNo16,
              assyNo10: entry.Incoming2r.assyNo10,
              oeNo: entry.Incoming2r.oeNo,
              emiPartName: entry.Incoming2r.EMIpartname,
            },
          });

          if (part) {
            await this.adjustStock({
              part2rId: part.id,
              quantity: -entry.qtyActualPacking, // Decrement stock
            });
          }
        }
      } catch (error) {
        console.error(`Failed to update stock for entry ${entry.id}:`, error);
        // Continue with other entries even if one fails
      }
    }

    // Finally delete the packing report (which will cascade delete entries)
    return this.prisma.packingReport.delete({
      where: { id },
      include: { entries: true }, // Include entries in the return for confirmation
    });
  }

  private async adjustStock(params: {
    part4rId?: number;
    part2rId?: number;
    quantity: number;
  }) {
    const { part4rId, part2rId, quantity } = params;

    const where = {
      part4rId: part4rId || null,
      part2rId: part2rId || null,
    };

    const existingStock = await this.prisma.stock.findFirst({
      where,
    });

    if (!existingStock) {
      throw new Error('Stock entry not found for this part');
    }

    // Prevent negative stock
    const newStock = existingStock.totalStock + quantity;
    if (newStock < 0) {
      throw new Error(
        `Cannot reduce stock below 0 (current: ${existingStock.totalStock}, attempted reduction: ${quantity})`,
      );
    }

    await this.prisma.stock.update({
      where: { id: existingStock.id },
      data: {
        totalStock: newStock,
        updatedAt: new Date(),
      },
    });
  }

  async generateExcel(report: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Packing Report');

    // Header Merging
    sheet.mergeCells('A1:A2');
    sheet.mergeCells('B1:D1');
    sheet.mergeCells('E1:G1');
    sheet.mergeCells('H1:H2');
    sheet.mergeCells('I1:I2');
    sheet.mergeCells('J1:J2');
    sheet.mergeCells('K1:M1');
    sheet.mergeCells('N1:N2');
    sheet.mergeCells('O1:O2');

    // Header Content
    sheet.getRow(1).values = [
      'No',
      'Jam',
      null,
      null,
      'PIC',
      null,
      null,
      'Packing Req No',
      'Explanner No',
      'Cust Part No',
      'Qty',
      null,
      null,
      'Type',
      'Keterangan',
    ];

    sheet.getRow(2).values = [
      null,
      'Mulai',
      'Selesai',
      'Menit',
      '1',
      '2',
      '3',
      null,
      null,
      null,
      'Plan',
      'Actual',
      '∆',
      null,
      null,
    ];

    // Header Styling
    for (let i = 1; i <= 2; i++) {
      const row = sheet.getRow(i);
      row.height = 20;
      row.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEFEFEF' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }

    // Column Widths
    sheet.columns = [
      { width: 5 },
      { width: 10 },
      { width: 10 },
      { width: 8 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 8 },
      { width: 25 },
    ];

    sheet.views = [{ state: 'frozen', ySplit: 2 }];

    // Data Rows
    report.entries.forEach((entry, index) => {
      const row = sheet.addRow([
        index + 1,
        entry.jamMulai ?? '-',
        entry.jamSelesai ?? '-',
        entry.menitPacking ?? '-',
        report.pic1?.name ?? '-',
        report.pic2?.name ?? '-',
        report.pic3?.name ?? '-',
        entry.packingReqNo ?? '-',
        entry.explannerNo ?? '-',
        entry.customerPartNo ?? '-',
        entry.qtyPlan ?? '-',
        entry.qtyActualPacking ?? '-',
        entry.balancePlanVsActual ?? '-',
        entry.type ?? '-',
        report.keterangan ?? '-',
      ]);

      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      if (index % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9F9F9' },
          };
        });
      }
    });
    // Calculate Qty
    const totalActual = report.entries.reduce(
      (sum, entry) => sum + (entry.qtyActualPacking ?? 0),
      0,
    );
    // Footer
    const footerRow = sheet.addRow([
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      `∆: ${totalActual ?? '-'}`,
      `2R: ${report.qty2R ?? '-'}`,
      `4R: ${report.qty4R ?? '-'}`,
      '',
      '',
    ]);
    footerRow.eachCell((cell, col) => {
      if (col >= 11 && col <= 13) {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Return Buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
