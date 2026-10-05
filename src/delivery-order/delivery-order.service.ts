//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   Logger,
// } from '@nestjs/common';

//     const { noDo, driverId, date, items } = createDto;

//     // Cek duplikat noDo

//       where: { noDo },
//     });

//       throw new BadRequestException(`No DO "${noDo}" sudah digunakan.`);

//     // Buat delivery order utama

//         noDo,
//         driverId,
//         date: date ? new Date(date) : new Date(), // pastikan ISO DateTime
//       },
//     });

//     // Proses setiap item dalam delivery

//       const { part2rId, part4rId, qtyDelivered } = item;

//         throw new BadRequestException(
//           'Setidaknya part2rId atau part4rId harus diisi.',
//         );

//       let stock;
//       Logger.log(part2rId, part4rId);

//             part4rId: part4rId ?? 0,
//           },
//         });

//             part2rId: part2rId ?? 0,
//           },
//         });

//       Logger.log(stock);

//         throw new NotFoundException(
//           `Stock tidak ditemukan untuk part2rId=${part2rId} part4rId=${part4rId}`,
//         );

//         throw new BadRequestException(
//           `Qty stock tidak cukup untuk part2rId=${part2rId} part4rId=${part4rId}`,
//         );

//           id: stock.id,
//         },

//             decrement: qtyDelivered,
//           },
//         },
//       });

//           deliveryOrderId: deliveryOrder.id,
//           part2rId,
//           part4rId,
//           qtyDelivered,
//         },
//       });

//     return { message: 'Delivery order berhasil dibuat', deliveryOrder };

//         driver: true,

//             part2r: true,
//             part4r: true,
//           },
//         },
//       },

//         date: 'desc',
//       },
//     });

//       where: { id },

//         driver: true,

//             part2r: true,
//             part4r: true,
//           },
//         },
//       },
//     });

//       throw new NotFoundException('Delivery order tidak ditemukan');

//     return order;

//     return { message: 'Fungsi update belum diimplementasikan' };

//       where: { id },
//     });

//     return { message: 'Delivery order berhasil dihapus' };

//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   Logger,
// } from "@nestjs/common";

//       const { noDo, driverId, customerId, date, items } = createDto;

//       // Check duplicate noDo

//         where: { noDo },
//       });

//         throw new BadRequestException(`No DO "${noDo}" sudah digunakan.`);

//       // Create main delivery order

//           noDo,
//           driverId,
//           customerId,
//           date: date ? new Date(date) : new Date(),
//         },
//       });

//       // Process each delivery item

//         const { part2rId, part4rId, qtyDelivered } = item;
//         const is4R = !!part4rId;
//         const partId = is4R ? part4rId : part2rId;

//         // Debug: Verify part ID type and value
//         this.logger.debug(
//           `Processing item: partId=${partId}, type=${typeof partId}, is4R=${is4R}`
//         );

//         // 1. Verify part exists (minimal query)
//         const partExists = await (is4R
//           ? prisma.partDatabase4r.count({ where: { id: partId } })
//           : prisma.partDatabase2r.count({ where: { id: partId } }));

//           throw new NotFoundException(
//             `Part ${is4R ? "4R" : "2R"} dengan ID ${partId} tidak ditemukan`
//           );

//         // 2. Find stock record with exact match

//         //     OR: [
//         //       { part2rId: is4R ? null : partId },
//         //       { part4rId: is4R ? partId : null },
//         //     ],
//         //   },
//         // });

//           where: is4R ? { part4rId: partId } : { part2rId: partId },
//         });

//         // Debug: Log all matching stock records

//           where: is4R ? { part4rId: partId } : { part2rId: partId },
//         });
//         this.logger.debug(`All stock records found:`, allStocks);

//           throw new NotFoundException(

//               is4R ? "4r" : "2r"
//             }Id=${partId}`
//           );

//         // Debug: Log the specific stock record being used

//           id: stock.id,
//           part2rId: stock.part2rId,
//           part4rId: stock.part4rId,
//           totalStock: stock.totalStock,
//           rack: stock.rack,
//         });

//         // 3. Verify stock quantity

//           throw new BadRequestException(

//               is4R ? "4r" : "2r"
//             }Id=${partId}. ` +
//               `Stock tersedia: ${stock.totalStock}, Qty diminta: ${qtyDelivered}`
//           );

//         // 4. Update stock

//           where: { id: stock.id },
//           data: { totalStock: { decrement: qtyDelivered } },
//         });

//           oldStock: stock.totalStock,
//           newStock: updatedStock.totalStock,
//           deducted: qtyDelivered,
//         });

//         // 5. Create delivery item

//             deliveryOrderId: deliveryOrder.id,
//             part2rId,
//             part4rId,
//             qtyDelivered,
//           },
//         });

//       return { message: "Delivery order berhasil dibuat", deliveryOrder };
//     });

//         driver: true,
//         customer: true,

//             part2r: true,
//             part4r: true,
//           },
//         },
//       },

//         date: "desc",
//       },
//     });

//       where: { id },

//         driver: true,
//         customer: true,

//             part2r: true,
//             part4r: true,
//           },
//         },
//       },
//     });

//       throw new NotFoundException("Delivery order tidak ditemukan");

//     return order;

//   //   return { message: "Fungsi update belum diimplementasikan" };

//   // DRIVER AND DATE

//     const existing = await prisma.deliveryOrder.findUnique({ where: { id } });

//       throw new NotFoundException('Delivery order tidak ditemukan');

//     const updateData: any = {};

//       const driverExists = await prisma.driver.count({ where: { id: dto.driverId } });

//         throw new NotFoundException(`Driver dengan ID ${dto.driverId} tidak ditemukan`);

//       updateData.driverId = dto.driverId;

//       updateData.date = new Date(dto.date);

//       throw new BadRequestException('Tidak ada data yang dikirim untuk diupdate');

//       where: { id },
//       data: updateData,

//         driver: true,
//         customer: true,
//         items: { include: { part2r: true, part4r: true } },
//       },
//     });

//     return { message: 'Delivery order berhasil diupdate', data: updated };
//   });

//         where: { id },
//         include: { items: true },
//       });

//         throw new NotFoundException("Delivery order tidak ditemukan");

//       // Restore stock for each item

//         const { part2rId, part4rId, qtyDelivered } = item;
//         const is4R = !!part4rId;

//         // Find stock record first

//           where: is4R ? { part4rId } : { part2rId },
//         });

//             where: { id: stock.id },

//                 increment: qtyDelivered,
//               },
//             },
//           });

//         where: { id },
//       });

//       return { message: "Delivery order berhasil dihapus" };
//     });

//     const targetDate = new Date(date);

//           gte: new Date(targetDate.setHours(0, 0, 0, 0)),
//           lte: new Date(targetDate.setHours(23, 59, 59, 999)),
//         },
//       },

//         driver: true,

//             part2r: true,
//             part4r: true,
//           },
//         },
//       },
//     });

//     const workbook = new ExcelJS.Workbook();
//     const sheet2R = workbook.addWorksheet("2R");
//     const sheet4R = workbook.addWorksheet("4R");

//     const header2R = [
//       "DO No",
//       "Driver",
//       "Code No",
//       "Date",
//       "Cust.",
//       "Seg.",
//       "Assy No 16 Digit",
//       "OE No.",
//       "Model",
//       "EMI Part Name",
//       "KPP",
//       "Qty",
//     ];

//     const header4R = [
//       "DO No",
//       "Driver",
//       "Code No",
//       "Date",
//       "Cust.",
//       "Seg.",
//       "Assy No 16 Digit",
//       "OE No.",
//       "Model",
//       "KPP",
//       "KPP NP",
//       "Qty",
//     ];

//     // Tambahkan header
//     sheet2R.addRow(header2R);
//     sheet4R.addRow(header4R);

//     // Tambahkan data

//       const doNo = order.noDo;
//       const driver = order.driver?.name;
//       const dateStr = format(new Date(order.date), "dd/MM/yyyy");

//           sheet2R.addRow([
//             doNo,
//             driver,
//             item.part2r.codeNo,
//             dateStr,
//             item.part2r.customer,
//             item.part2r.segment,
//             item.part2r.assyNo16,
//             item.part2r.oeNo,
//             item.part2r.model,
//             item.part2r.emiPartName,
//             item.part2r.kpp,
//             item.qtyDelivered,
//           ]);

//           sheet4R.addRow([
//             doNo,
//             driver,
//             item.part4r.codeNo,
//             dateStr,
//             item.part4r.customer,
//             item.part4r.segment,
//             item.part4r.assyNo16,
//             item.part4r.oeNo,
//             item.part4r.model,
//             item.part4r.kpp,
//             item.part4r.kppNp,
//             item.qtyDelivered,
//           ]);

//     });

//     // Fungsi styling untuk header

//       const headerRow = sheet.getRow(1);
//       headerRow.font = { bold: true };
//       headerRow.alignment = { vertical: "middle", horizontal: "center" };

//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "FFDCE6F1" }, // biru muda
//         };

//           top: { style: "thin" },
//           bottom: { style: "thin" },
//           left: { style: "thin" },
//           right: { style: "thin" },
//         };
//       });

//       // Set filter

//         from: { row: 1, column: 1 },
//         to: { row: 1, column: headerLength },
//       };

//       // Auto width kolom

//         let maxLength = 12;

//           const len = cell.value?.toString().length || 0;
//           if (len > maxLength) maxLength = len;
//         });
//         column.width = maxLength + 2;
//       });
//     };

//     styleHeader(sheet2R, header2R.length);
//     styleHeader(sheet4R, header4R.length);

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=delivery_orders_${date}.xlsx`
//     );

//     res.end();

//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   Logger,
// } from '@nestjs/common';

//     const { noDo, driverId, date, items } = createDto;

//     // Cek duplikat noDo

//       where: { noDo },
//     });

//       throw new BadRequestException(`No DO "${noDo}" sudah digunakan.`);

//     // Buat delivery order utama

//         noDo,
//         driverId,
//         date: date ? new Date(date) : new Date(), // pastikan ISO DateTime
//       },
//     });

//     // Proses setiap item dalam delivery

//       const { part2rId, part4rId, qtyDelivered } = item;

//         throw new BadRequestException(
//           'Setidaknya part2rId atau part4rId harus diisi.',
//         );

//       let stock;
//       Logger.log(part2rId, part4rId);

//             part4rId: part4rId ?? 0,
//           },
//         });

//             part2rId: part2rId ?? 0,
//           },
//         });

//       Logger.log(stock);

//         throw new NotFoundException(
//           `Stock tidak ditemukan untuk part2rId=${part2rId} part4rId=${part4rId}`,
//         );

//         throw new BadRequestException(
//           `Qty stock tidak cukup untuk part2rId=${part2rId} part4rId=${part4rId}`,
//         );

//           id: stock.id,
//         },

//             decrement: qtyDelivered,
//           },
//         },
//       });

//           deliveryOrderId: deliveryOrder.id,
//           part2rId,
//           part4rId,
//           qtyDelivered,
//         },
//       });

//     return { message: 'Delivery order berhasil dibuat', deliveryOrder };

//         driver: true,

//             part2r: true,
//             part4r: true,
//           },
//         },
//       },

//         date: 'desc',
//       },
//     });

//       where: { id },

//         driver: true,

//             part2r: true,
//             part4r: true,
//           },
//         },
//       },
//     });

//       throw new NotFoundException('Delivery order tidak ditemukan');

//     return order;

//     return { message: 'Fungsi update belum diimplementasikan' };

//       where: { id },
//     });

//     return { message: 'Delivery order berhasil dihapus' };

import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { format } from 'date-fns';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order.dto';
import { UpdateDeliveryOrderDto } from './dto/update-delivery-order.dto';
import { Status } from '@prisma/client';
import { firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
@Injectable()
export class DeliveryOrderService {
  private readonly logger = new Logger(DeliveryOrderService.name);

  constructor(
    private readonly prisma: PrismaService,

    private http: HttpService,
  ) {}

  //     const { noDo, driverId, customerId, date, items } = createDto;

  //     // Check duplicate noDo

  //       where: { noDo },
  //     });

  //       throw new BadRequestException(`No DO "${noDo}" sudah digunakan.`);

  //     // Create main delivery order

  //         noDo,
  //         driverId,
  //         customerId,
  //         date: date ? new Date(date) : new Date(),
  //       },
  //     });

  //     // Process each delivery item

  //       const { part2rId, part4rId, qtyDelivered } = item;
  //       const is4R = !!part4rId;
  //       const partId = is4R ? part4rId : part2rId;

  //       // Debug: Verify part ID type and value
  //       this.logger.debug(
  //         `Processing item: partId=${partId}, type=${typeof partId}, is4R=${is4R}`,
  //       );

  //       // 1. Verify part exists (minimal query)
  //       const partExists = await (is4R
  //         ? prisma.partDatabase4r.count({ where: { id: partId } })
  //         : prisma.partDatabase2r.count({ where: { id: partId } }));

  //         throw new NotFoundException(
  //           `Part ${is4R ? '4R' : '2R'} dengan ID ${partId} tidak ditemukan`,
  //         );

  //         where: is4R ? { part4rId: partId } : { part2rId: partId },
  //       });

  //       // Debug: Log all matching stock records

  //         where: is4R ? { part4rId: partId } : { part2rId: partId },
  //       });
  //       this.logger.debug(`All stock records found:`, allStocks);

  //         throw new NotFoundException(
  //           `Stock record tidak ditemukan untuk part${is4R ? '4r' : '2r'}Id=${partId}`,
  //         );

  //       // Debug: Log the specific stock record being used

  //         id: stock.id,
  //         part2rId: stock.part2rId,
  //         part4rId: stock.part4rId,
  //         totalStock: stock.totalStock,
  //         rack: stock.rack,
  //       });

  //       // 3. Verify stock quantity

  //         throw new BadRequestException(
  //           `Qty stock tidak cukup untuk part${is4R ? '4r' : '2r'}Id=${partId}. ` +
  //             `Stock tersedia: ${stock.totalStock}, Qty diminta: ${qtyDelivered}`,
  //         );

  //       // 4. Update stock

  //         where: { id: stock.id },
  //         data: { totalStock: { decrement: qtyDelivered } },
  //       });

  //         oldStock: stock.totalStock,
  //         newStock: updatedStock.totalStock,
  //         deducted: qtyDelivered,
  //       });

  //       // 5. Create delivery item

  //           deliveryOrderId: deliveryOrder.id,
  //           part2rId,
  //           part4rId,
  //           qtyDelivered,
  //         },
  //       });

  //     return { message: 'Delivery order berhasil dibuat', deliveryOrder };
  //   });

  //     const { noDo, driverId, customerId, date, scheduleId, items } = createDto;

  //     // Cek noDo duplikat

  //       where: { noDo },
  //     });

  //       throw new BadRequestException(`No DO "${noDo}" sudah digunakan.`);

  //     // Jika ada scheduleId, validasi schedule dan driver

  //         where: { id: scheduleId },
  //         include: { customers: true },
  //       });

  //         throw new NotFoundException(`Schedule dengan ID ${scheduleId} tidak ditemukan`);

  //       // Validasi driver sama dengan driver di schedule

  //         throw new BadRequestException(`Driver tidak sesuai dengan schedule`);

  //       // Validasi customer termasuk dalam schedule (opsional)
  //       const customerIncluded = schedule.customers.some(
  //         (c) => c.customerId === customerId,
  //       );

  //         throw new BadRequestException(`Customer tidak termasuk dalam schedule ini`);

  //     // Buat delivery order

  //         noDo,
  //         driverId,
  //         customerId,
  //         scheduleId: scheduleId ?? null, // ✅ masukkan scheduleId
  //         date: date ? new Date(date) : new Date(),
  //       },
  //     });

  //     // Looping item

  //       const { part2rId, part4rId, qtyDelivered } = item;
  //       const is4R = !!part4rId;
  //       const partId = is4R ? part4rId : part2rId;

  //       // 1. Pastikan part ada
  //       const partExists = await (is4R
  //         ? prisma.partDatabase4r.count({ where: { id: partId } })
  //         : prisma.partDatabase2r.count({ where: { id: partId } }));

  //         throw new NotFoundException(
  //           `Part ${is4R ? '4R' : '2R'} dengan ID ${partId} tidak ditemukan`,
  //         );

  //       // 2. Ambil stock

  //         where: is4R ? { part4rId: partId } : { part2rId: partId },
  //       });

  //         throw new NotFoundException(
  //           `Stock record tidak ditemukan untuk part${is4R ? '4r' : '2r'}Id=${partId}`,
  //         );

  //       // 3. Cek stock cukup

  //         throw new BadRequestException(
  //           `Qty stock tidak cukup untuk part${is4R ? '4r' : '2r'}Id=${partId}. ` +
  //             `Stock tersedia: ${stock.totalStock}, Qty diminta: ${qtyDelivered}`,
  //         );

  //       // 4. Update stock

  //         where: { id: stock.id },
  //         data: { totalStock: { decrement: qtyDelivered } },
  //       });

  //       // 5. Create delivery item

  //           deliveryOrderId: deliveryOrder.id,
  //           part2rId,
  //           part4rId,
  //           qtyDelivered,
  //         },
  //       });

  //     return { message: 'Delivery order berhasil dibuat', deliveryOrder };
  //   });

  async create(createDto: CreateDeliveryOrderDto) {
    try {
      // 1️⃣ Buat delivery order & items di transaction
      const createdOrder = await this.prisma.$transaction(async (prisma) => {
        const { noDo, driverId, customerId, date, scheduleId, items } =
          createDto;

        // Cek noDo duplikat
        const existingOrder = await prisma.deliveryOrder.findUnique({
          where: { noDo },
        });
        if (existingOrder)
          throw new BadRequestException(`No DO "${noDo}" sudah digunakan.`);

        // Validasi schedule jika ada
        if (scheduleId) {
          const schedule = await prisma.scheduleTruck.findUnique({
            where: { id: scheduleId },
            include: { customers: true },
          });
          if (!schedule)
            throw new NotFoundException(
              `Schedule ID ${scheduleId} tidak ditemukan`,
            );
          if (schedule.driverId !== driverId)
            throw new BadRequestException(
              `Driver tidak sesuai dengan schedule`,
            );
          const customerIncluded = schedule.customers.some(
            (c) => c.customerId === customerId,
          );
          if (!customerIncluded)
            throw new BadRequestException(
              `Customer tidak termasuk dalam schedule`,
            );
        }

        // Create delivery order
        const deliveryOrder = await prisma.deliveryOrder.create({
          data: {
            noDo,
            driverId,
            customerId,
            scheduleId: scheduleId ?? null,
            date: date ? new Date(date) : new Date(),
          },
        });

        // Create items
        for (const item of items) {
          const { part2rId, part4rId, qtyDelivered } = item;
          const is4R = !!part4rId;
          const partId = is4R ? part4rId : part2rId;

          // Pastikan part ada
          const partExists = await (is4R
            ? prisma.partDatabase4r.count({ where: { id: partId } })
            : prisma.partDatabase2r.count({ where: { id: partId } }));
          if (!partExists)
            throw new NotFoundException(
              `Part ${is4R ? '4R' : '2R'} ID ${partId} tidak ditemukan`,
            );

          // Ambil stock
          const stock = await prisma.stock.findFirst({
            where: is4R ? { part4rId: partId } : { part2rId: partId },
          });
          if (!stock)
            throw new NotFoundException(
              `Stock record untuk part${is4R ? '4R' : '2R'} ID ${partId} tidak ditemukan`,
            );
          if (stock.totalStock < qtyDelivered)
            throw new BadRequestException(
              `Stock tidak cukup untuk part${is4R ? '4R' : '2R'} ID ${partId}. Stock: ${stock.totalStock}, Qty: ${qtyDelivered}`,
            );

          // Update stock & create delivery item
          await prisma.stock.update({
            where: { id: stock.id },
            data: { totalStock: { decrement: qtyDelivered } },
          });
          await prisma.deliveryItem.create({
            data: {
              deliveryOrderId: deliveryOrder.id,
              part2rId,
              part4rId,
              qtyDelivered,
            },
          });
        }

        return deliveryOrder;
      });

      // 2️⃣ Ambil delivery order lengkap dengan relasi
      const deliveryOrderWithRelations =
        await this.prisma.deliveryOrder.findUnique({
          where: { id: createdOrder.id },
          include: {
            items: { include: { part2r: true, part4r: true } },
            driver: true,
            customer: true,
            schedule: { include: { truck: true } },
          },
        });

      // 3️⃣ Generate WA message
      // const waMessage = this.generateWAMessage([deliveryOrderWithRelations]);

      return {
        message: 'Delivery order berhasil dibuat',
        deliveryOrder: deliveryOrderWithRelations,
        // waMessage,
      };
    } catch (error: any) {
      this.logger.error('Error create delivery order', error);
      throw error;
    }
  }

  // =========================================
  // KIRIM WHATSAPP OTOMATIS
  // =========================================

  //         target: '120363401514892754@g.us',
  //         phoneNumber: '083891056151',
  //         message,
  //       }),
  //     );

  //     this.logger.error('Gagal kirim WA:', error.message);

  // =========================================
  // GENERATE PESAN WA
  // =========================================

  //   let msg = '*NEW DELIVERY ORDER*\n───────────────\n';

  //   const labels = ['DATE', 'DRIVER', 'CUSTOMER', 'TRUCK', 'CYCLE'];
  //   const maxLabelLength = Math.max(...labels.map(l => l.length));
  //   const padLabel = (label: string) => label.padEnd(maxLabelLength + 2, ' ');

  //     const dateStr = format(new Date(order.date), 'dd-MM-yyyy');
  //     const driver = order.driver?.name ?? '-';
  //     const customer = order.customer?.name ?? '-';
  //     const truck = order.schedule?.truck?.noPol ?? '-';
  //     const cycle = order.schedule?.cycle ?? '-';

  //     // Header DO
  //     msg += `> ${order.noDo}\n`;
  //     msg += '```\n';
  //     msg += `${padLabel('DATE')}: ${dateStr}\n`;
  //     msg += `${padLabel('DRIVER')}: ${driver}\n`;
  //     msg += `${padLabel('CUSTOMER')}: ${customer}\n`;
  //     msg += `${padLabel('TRUCK')}: ${truck}\n`;
  //     msg += `${padLabel('CYCLE')}: ${cycle}\n`;
  //     msg += '```\n';
  //     msg += '*Items:*\n';

  //     // Items: cari panjang maksimal OE

  //       oeNo: (item.part2r ?? item.part4r)?.oeNo ?? '-',
  //       qty: item.qtyDelivered ?? 0,
  //     }));
  //     const maxOeNoLength = Math.max(...items.map(i => i.oeNo.length));

  //       const oeNoPadded = i.oeNo.padEnd(maxOeNoLength, ' ');
  //       msg += `- ${oeNoPadded}   ||   ${i.qty}\n`;
  //     });

  //     msg += '───────────────\n';
  //   });

  //   msg += '> _Generated by NOVA_';
  //   return msg;

  //   if (!orders || orders.length === 0) return '> _No delivery orders_';

  //   // Ambil tanggal delivery dari order dengan deliverytime terbaru
  //   const deliveryDates = orders
  //     .map(o => o.deliverytime)
  //     .filter(Boolean)
  //     .map(d => new Date(d));

  //   // Kalau ada, ambil tanggal terbesar (latest deliverytime)
  //   const deliveryDateStr = deliveryDates.length
  //     ? format(new Date(Math.max(...deliveryDates.map(d => d.getTime()))), 'dd/MM/yyyy')
  //     : '-';

  //   // Ambil info driver/truck/cycle dari first order
  //   const firstOrder = orders[0];
  //   const driver = firstOrder.driver?.name ?? '-';
  //   const truck = firstOrder.schedule?.truck?.noPol ?? '-';
  //   const cycle = firstOrder.schedule?.cycle ?? '-';
  //   const totalQtyAll = orders.reduce(
  //     (sum, o) => sum + o.items.reduce((s, i) => s + (i.qtyDelivered ?? 0), 0),
  //     0,
  //   );

  //   // Ambil deliveryTime dari first order
  //   const deliveryTime = firstOrder.deliverytime
  //     ? format(new Date(firstOrder.deliverytime), 'HH.mm')
  //     : '-';

  //   let msg = `*DELIVERY ORDER - ${deliveryDateStr}*\n────────────────\n`;
  //   msg += `Driver: ${driver}\nTruck: ${truck}\nCycle: ${cycle}\nTotal Qty: ${totalQtyAll}\nDelivery Time: ${deliveryTime}\n────────────────\n\n`;

  //   // Group orders by customer

  //     const customerName = order.customer?.name ?? '-';
  //     if (!acc[customerName]) acc[customerName] = [];
  //     acc[customerName].push(order);
  //     return acc;
  //   }, {} as Record<string, any[]>);

  //     // Hitung totalQty per customer
  //     const totalQtyCustomer = ordersByCustomer.reduce(
  //       (sum, o) => sum + o.items.reduce((s, i) => s + (i.qtyDelivered ?? 0), 0),
  //       0,
  //     );

  //     msg += `▼ ${customer}   Total: ${totalQtyCustomer}\n`;

  //       msg += ` ❯ ${order.noDo}\n`;

  //         const model = (i.part2r ?? i.part4r)?.model ?? '-';
  //         const qty = i.qtyDelivered ?? 0;
  //         msg += `  • ${model} (${qty})\n`;
  //       });
  //       msg += '\n';

  //   msg += '> Generated by NOVA';
  //   return msg;

  //   if (!orders || orders.length === 0) return '> _No delivery orders_';

  //   // Ambil tanggal delivery dari order dengan deliverytime terbaru
  //   const deliveryDates = orders
  //     .map(o => o.deliverytime)
  //     .filter(Boolean)
  //     .map(d => new Date(d));

  //   const deliveryDateStr = deliveryDates.length
  //     ? format(new Date(Math.max(...deliveryDates.map(d => d.getTime()))), 'dd/MM/yyyy')
  //     : '-';

  //   // Ambil info driver/truck/cycle dari first order
  //   const firstOrder = orders[0];
  //   const driver = firstOrder.driver?.name ?? '-';
  //   const truck = firstOrder.schedule?.truck?.noPol ?? '-';
  //   const cycle = firstOrder.schedule?.cycle ?? '-';
  //   const totalQtyAll = orders.reduce(
  //     (sum, o) => sum + o.items.reduce((s, i) => s + (i.qtyDelivered ?? 0), 0),
  //     0,
  //   );

  //   // ✅ Ambil deliveryTime pakai WIB
  //   const deliveryTime = firstOrder.deliverytime

  //         hour: '2-digit',
  //         minute: '2-digit',
  //         timeZone: 'Asia/Jakarta',
  //       }).replace(':', '.')
  //     : 'preparing';

  //   let msg = `*DELIVERY ORDER - ${deliveryDateStr}*\n────────────────\n`;
  //   msg += `Driver: ${driver}\nTruck: ${truck}\nCycle: ${cycle}\nTotal Qty: ${totalQtyAll}\nDelivery Time: ${deliveryTime}\n────────────────\n\n`;

  //   // Group orders by customer

  //     const customerName = order.customer?.name ?? '-';
  //     if (!acc[customerName]) acc[customerName] = [];
  //     acc[customerName].push(order);
  //     return acc;
  //   }, {} as Record<string, any[]>);

  //     const totalQtyCustomer = ordersByCustomer.reduce(
  //       (sum, o) => sum + o.items.reduce((s, i) => s + (i.qtyDelivered ?? 0), 0),
  //       0,
  //     );

  //     msg += `▼ ${customer}   Total: ${totalQtyCustomer}\n`;

  //       msg += ` ❯ ${order.noDo}\n`;

  //         const model = i.part4r?.model ?? i.part2r?.emiPartName ?? '-';
  //         const qty = i.qtyDelivered ?? 0;
  //         msg += `  • ${model} (${qty})\n`;
  //       });
  //       msg += '\n';

  //   msg += '> Generated by NOVA';
  //   return msg;

  async findAll(page?: number, limit?: number) {
    if (!page || !limit) {
      return this.prisma.deliveryOrder.findMany({
        take: 500,
        include: {
          driver: true,
          customer: true,
          schedule: { include: { truck: true, driver: true } },
          items: {
            include: { part2r: true, part4r: true },
          },
        },
        orderBy: { date: 'desc' },
      });
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.deliveryOrder.findMany({
        skip,
        take: limit,
        include: {
          driver: true,
          customer: true,
          schedule: { include: { truck: true, driver: true } },
          items: {
            include: { part2r: true, part4r: true },
          },
        },
        orderBy: { date: 'desc' },
      }),
      this.prisma.deliveryOrder.count(),
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
    const order = await this.prisma.deliveryOrder.findUnique({
      where: { id },
      include: {
        driver: true,
        customer: true,
        items: {
          include: {
            part2r: true,
            part4r: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Delivery order tidak ditemukan');
    }

    return order;
  }

  // ONLY DRIVER

  //     // Pastikan order ada

  //       where: { id },
  //     });

  //       throw new NotFoundException('Delivery order tidak ditemukan');

  //     // Pastikan driverId dikirim

  //       throw new BadRequestException('driverId wajib diisi untuk update driver');

  //     // Cek apakah driver ada

  //       where: { id: dto.driverId },
  //     });

  //       throw new NotFoundException(`Driver dengan ID ${dto.driverId} tidak ditemukan`);

  //     // Update driver saja

  //       where: { id },
  //       data: { driverId: dto.driverId },

  //         driver: true,
  //         customer: true,

  //           include: { part2r: true, part4r: true },
  //         },
  //       },
  //     });

  //     return { message: 'Driver berhasil diupdate', data: updated };
  //   });

  // DRIVER AND DATE

  //     const existing = await prisma.deliveryOrder.findUnique({ where: { id } });

  //       throw new NotFoundException('Delivery order tidak ditemukan');

  //     const updateData: any = {};

  //       const driverExists = await prisma.driver.count({ where: { id: dto.driverId } });

  //         throw new NotFoundException(`Driver dengan ID ${dto.driverId} tidak ditemukan`);

  //       updateData.driverId = dto.driverId;

  //       updateData.date = new Date(dto.date);

  //       throw new BadRequestException('Tidak ada data yang dikirim untuk diupdate');

  //       where: { id },
  //       data: updateData,

  //         driver: true,
  //         customer: true,
  //         items: { include: { part2r: true, part4r: true } },
  //       },
  //     });

  //     return { message: 'Delivery order berhasil diupdate', data: updated };
  //   });

  async update(id: number, dto: UpdateDeliveryOrderDto) {
    return this.prisma.$transaction(async (prisma) => {
      const existing = await prisma.deliveryOrder.findUnique({ where: { id } });

      if (!existing) {
        throw new NotFoundException('Delivery order tidak ditemukan');
      }

      const updateData: any = {};

      if (dto.driverId !== undefined) {
        const driverExists = await prisma.driver.count({
          where: { id: dto.driverId },
        });
        if (!driverExists) {
          throw new NotFoundException(
            `Driver dengan ID ${dto.driverId} tidak ditemukan`,
          );
        }
        updateData.driverId = dto.driverId;
      }

      if (dto.date !== undefined) {
        updateData.date = new Date(dto.date);
      }

      // Tambahkan handling deliverytime
      if (dto.deliverytime !== undefined) {
        updateData.deliverytime = new Date(dto.deliverytime);
      }
      //console.log('Check 0:', id);
      if (Object.keys(updateData).length === 0) {
        throw new BadRequestException(
          'Tidak ada data yang dikirim untuk diupdate',
        );
      }
      //console.log('Check 1:', id);

      const updated = await prisma.deliveryOrder.update({
        where: { id },
        data: updateData,
        include: {
          driver: true,
          customer: true,
          items: { include: { part2r: true, part4r: true } },
        },
      });
      //console.log('Check 2:', id);
      return { message: 'Delivery order berhasil diupdate', data: updated };
    });
  }

  async remove(id: number) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const order = await prisma.deliveryOrder.findUnique({
          where: { id },
          include: { items: true },
        });

        if (!order) {
          throw new NotFoundException('Delivery order tidak ditemukan');
        }

        for (const item of order.items) {
          const { part2rId, part4rId, qtyDelivered } = item;
          if (!qtyDelivered || (!part2rId && !part4rId)) continue;

          const stock = await prisma.stock.findFirst({
            where: part4rId ? { part4rId } : { part2rId },
          });

          if (stock) {
            await prisma.stock.update({
              where: { id: stock.id },
              data: {
                totalStock: {
                  increment: qtyDelivered,
                },
              },
            });
          }
        }

        await prisma.deliveryOrder.delete({
          where: { id },
        });

        return { message: 'Delivery order berhasil dihapus' };
      });
    } catch (error) {
      console.error('Gagal menghapus delivery order:', error);
      throw new InternalServerErrorException('Gagal menghapus delivery order');
    }
  }

  async findManyWithRelations(orderIds: number[]) {
    if (!orderIds || orderIds.length === 0) return [];

    return this.prisma.deliveryOrder.findMany({
      where: { id: { in: orderIds } },
      include: {
        driver: true,
        customer: true,
        schedule: { include: { truck: true } },
        items: { include: { part2r: true, part4r: true } },
      },
    });
  }

  async exportToExcelByDate(date: string, type: string, res: Response) {
    const targetDate = new Date(date);

    const orders = await this.prisma.deliveryOrder.findMany({
      where: {
        date: {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lte: new Date(targetDate.setHours(23, 59, 59, 999)),
        },
      },
      include: {
        driver: true,
        items: {
          include: {
            part2r: true,
            part4r: true,
          },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet2R = workbook.addWorksheet('2R');
    const sheet4R = workbook.addWorksheet('4R');

    const header2R = [
      'DO No',
      'Driver',
      'Code No',
      'Date',
      'Cust.',
      'Seg.',
      'Assy No 16 Digit',
      'OE No.',
      'Model',
      'EMI Part Name',
      'KPP',
      'Qty',
    ];

    const header4R = [
      'DO No',
      'Driver',
      'Code No',
      'Date',
      'Cust.',
      'Seg.',
      'Assy No 16 Digit',
      'OE No.',
      'Model',
      'KPP',
      'KPP NP',
      'Qty',
    ];

    // Tambahkan header
    sheet2R.addRow(header2R);
    sheet4R.addRow(header4R);

    // Tambahkan data
    orders.forEach((order) => {
      const doNo = order.noDo;
      const driver = order.driver?.name;
      const dateStr = format(new Date(order.date), 'dd/MM/yyyy');

      for (const item of order.items) {
        if ((type === 'ALL' || type === '2R') && item.part2r) {
          sheet2R.addRow([
            doNo,
            driver,
            item.part2r.codeNo,
            dateStr,
            item.part2r.customer,
            item.part2r.segment,
            item.part2r.assyNo16,
            item.part2r.oeNo,
            item.part2r.model,
            item.part2r.emiPartName,
            item.part2r.kpp,
            item.qtyDelivered,
          ]);
        }

        if ((type === 'ALL' || type === '4R') && item.part4r) {
          sheet4R.addRow([
            doNo,
            driver,
            item.part4r.codeNo,
            dateStr,
            item.part4r.customer,
            item.part4r.segment,
            item.part4r.assyNo16,
            item.part4r.oeNo,
            item.part4r.model,
            item.part4r.kpp,
            item.part4r.kppNp,
            item.qtyDelivered,
          ]);
        }
      }
    });

    // Fungsi styling untuk header
    const styleHeader = (sheet, headerLength: number) => {
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFDCE6F1' }, // biru muda
        };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Set filter
      sheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: headerLength },
      };

      // Auto width kolom
      sheet.columns.forEach((column) => {
        let maxLength = 12;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const len = cell.value?.toString().length || 0;
          if (len > maxLength) maxLength = len;
        });
        column.width = maxLength + 2;
      });
    };

    styleHeader(sheet2R, header2R.length);
    styleHeader(sheet4R, header4R.length);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=delivery_orders_${date}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
