//       jamMulai,
//       jamSelesai,
//       qtyActualPacking,
//       packingReqNo,
//       type,
//       packingReportId,
//       Incoming4rId,
//       Incoming2rId,
//       ...rest
//     } = dto;

//     const prNo = packingReqNo.trim();
//     const tp = type.trim();

//       throw new Error("packingReportId wajib disertakan!");

//         packingReportId,
//         packingReqNo: prNo,
//         type: tp,
//       },
//     });

//         where: { id: existing.id },

//             increment: parseInt(qtyActualPacking ?? "0"),
//           },
//           jamMulai,
//           jamSelesai,
//         },
//       });

//     // ⛳ Siapkan objek data

//       ...rest,
//       packingReportId,
//       packingReqNo: prNo,
//       type: tp,
//       qtyActualPacking: parseInt(qtyActualPacking ?? "0"),
//       jamMulai,
//       jamSelesai,
//     };

//     // 🔍 Auto-cari Incoming ID jika tidak dikirim dari DTO

//         dataToCreate.Incoming4rId = Incoming4rId;

//           where: { prId: prNo },
//         });
//         if (!incoming)
//           throw new Error(`PR ID ${prNo} tidak ditemukan di Incoming4r`);
//         dataToCreate.Incoming4rId = incoming.id;

//         dataToCreate.Incoming2rId = Incoming2rId;

//           where: { prId: prNo },
//         });
//         if (!incoming)
//           throw new Error(`PR ID ${prNo} tidak ditemukan di Incoming2r`);
//         dataToCreate.Incoming2rId = incoming.id;

//     return this.prisma.packingEntry.create({ data: dataToCreate });

//       where: { id },
//       data: { status },
//     });

//       where: { id },

//         id: true,
//         type: true,
//         packingReqNo: true,
//         Incoming2rId: true,
//         Incoming4rId: true,
//         packingReportId: true,
//       },
//     });

//     if (!entry) throw new Error(`Entry dengan id ${id} tidak ditemukan`);

//     // Get All Entry

//         packingReqNo: entry.packingReqNo,
//         type: entry.type,
//       },
//     });

//     const totalActual = allSamePR.reduce(
//       (sum, e) => sum + (e.qtyActualPacking ?? 0),
//       0
//     );

//     const plan = allSamePR[0].qtyPlan ?? 0;

//       // Approve All Entry

//           packingReqNo: entry.packingReqNo,
//           type: entry.type,
//         },
//         data: { status: Status.APPROVED },
//       });

//       const totalPlan = allSamePR[0].qtyPlan ?? 0;

//             where: { id: entry.Incoming4rId },

//               status: Status.APPROVED,
//               qtyActual: totalActual,
//             },
//           });

//             where: { id: entry.Incoming2rId },

//               status: Status.APPROVED,
//               qtyActual: totalActual,
//             },
//           });

//       // Get All Report
//       const affectedReportIds = [
//         ...new Set(allSamePR.map((e) => e.packingReportId)),
//       ];

//           where: { packingReportId: reportId },
//         });

//         const allFinal = entriesInReport.every(
//           (e) => e.status === Status.APPROVED || e.status === Status.REJECTED
//         );

//           const allApproved = entriesInReport.every(
//             (e) => e.status === Status.APPROVED
//           );

//             where: { id: reportId },

//               status: allApproved ? Status.APPROVED : Status.REJECTED,
//             },
//           });

//         message: `Semua entry dengan PR ${entry.packingReqNo} berhasil di-APPROVE.`,
//         totalActual,
//         plan,
//       };

//         message: `Belum bisa approve. Total actual: ${totalActual}, Plan: ${plan}`,
//         totalActual,
//         plan,
//       };

//     const entry = await this.prisma.packingEntry.findUnique({ where: { id } });

//     if (!entry) throw new Error(`Entry dengan id ${id} tidak ditemukan`);

//         packingReqNo: entry.packingReqNo,
//         type: entry.type,
//       },
//       data: { status: Status.REJECTED },
//     });

//     // Check Status Report

//       where: { packingReportId: entry.packingReportId },
//     });

//     const allFinal = entriesInReport.every(
//       (e) => e.status === Status.APPROVED || e.status === Status.REJECTED
//     );

//       const allApproved = entriesInReport.every(
//         (e) => e.status === Status.APPROVED
//       );

//         where: { id: entry.packingReportId },

//           status: allApproved ? Status.APPROVED : Status.REJECTED,
//         },
//       });

//       message: `Semua entry dengan PR ${entry.packingReqNo} berhasil di-REJECT.`,
//     };

//       include: { packingReport: true },
//     });

//     return entries;

//       where: { id },
//       include: { packingReport: true },
//     });

//     const forbiddenFields = [
//       "id",
//       "createdAt",
//       "updatedAt",
//       "Incoming2r",
//       "Incoming4r",
//       "packingReport",
//       "tanggalPacking",
//       "lineNo",
//       "pic1",
//       "pic2",
//       "pic3",
//     ];

//     const data: Record<string, any> = {};

//         data[key] = (dto as any)[key];

//     // Prisma relasi handler

//       data.Incoming4r = dto.Incoming4rId

//         : { disconnect: true };
//       delete data.Incoming4rId;

//       data.part2r = dto.part2rId

//         : { disconnect: true };
//       delete data.part2rId;

//       data.part4r = dto.part4rId

//         : { disconnect: true };
//       delete data.part4rId;

//       data.pic1 = dto.pic1Id

//         : { disconnect: true };
//       delete data.pic1Id;

//       data.pic2 = dto.pic2Id

//         : { disconnect: true };
//       delete data.pic2Id;

//       data.pic3 = dto.pic3Id

//         : { disconnect: true };
//       delete data.pic3Id;

//       data.Incoming2r = dto.Incoming2rId

//         : { disconnect: true };
//       delete data.Incoming2rId;

//       data.packingReport = dto.packingReportId

//         : undefined;
//       delete data.packingReportId;

//     // ?? Update entry utama

//       where: { id },
//       data,
//     });

//     // ?? Cek semua entry dengan PR dan type yang sama

//         packingReqNo: updated.packingReqNo,
//         type: updated.type,
//       },
//     });

//     const totalActual = allSamePR.reduce(
//       (sum, e) => sum + (e.qtyActualPacking ?? 0),
//       0
//     );
//     const plan = allSamePR[0]?.qtyPlan ?? 0;

//     // ? Jika qty sekarang kurang dari plan, maka reset status jadi PENDING

//           packingReqNo: updated.packingReqNo,
//           type: updated.type,
//         },
//         data: { status: Status.PENDING },
//       });

//           where: { id: updated.Incoming4rId },

//             status: Status.PENDING,
//             qtyActual: totalActual,
//           },
//         });

//           where: { id: updated.Incoming2rId },

//             status: Status.PENDING,
//             qtyActual: totalActual,
//           },
//         });

//       // ?? Update juga status packing report terkait
//       const affectedReportIds = [
//         ...new Set(allSamePR.map((e) => e.packingReportId)),
//       ];

//           where: { id: reportId },
//           data: { status: Status.PENDING },
//         });

//     return updated;

//     return this.prisma.packingEntry.delete({ where: { id } });

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { CreatePackingEntryDto } from './dto/create-packing-entry.dto';
import { UpdatePackingEntryDto } from './dto/update-packing-entry.dto';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class PackingEntryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePackingEntryDto) {
    const {
      jamMulai,
      jamSelesai,
      qtyActualPacking,
      packingReqNo,
      type,
      packingReportId,
      Incoming4rId,
      Incoming2rId,
      ...rest
    } = dto;

    const prNo = packingReqNo.trim();
    const tp = type.trim();

    if (!packingReportId) {
      throw new Error('packingReportId wajib disertakan!');
    }

    const existing = await this.prisma.packingEntry.findFirst({
      where: {
        packingReportId,
        packingReqNo: prNo,
        type: tp,
      },
    });

    if (existing) {
      const updatedEntry = await this.prisma.packingEntry.update({
        where: { id: existing.id },
        data: {
          qtyActualPacking: {
            increment: parseInt(qtyActualPacking ?? '0'),
          },
          jamMulai,
          jamSelesai,
        },
      });

      // Update stock quantity
      await this.updateStock(updatedEntry, parseInt(qtyActualPacking ?? '0'));
      return updatedEntry;
    }

    // Prepare data object
    const dataToCreate: any = {
      ...rest,
      packingReportId,
      packingReqNo: prNo,
      type: tp,
      qtyActualPacking: parseInt(qtyActualPacking ?? '0'),
      jamMulai,
      jamSelesai,
      status: Status.PENDING, // Ensure new entries are PENDING
    };

    // Auto-find Incoming ID if not provided in DTO
    if (tp === '4R') {
      if (Incoming4rId) {
        dataToCreate.Incoming4rId = Incoming4rId;
      } else {
        const incoming = await this.prisma.incoming4r.findFirst({
          where: { prId: prNo },
        });
        if (!incoming)
          throw new Error(`PR ID ${prNo} tidak ditemukan di Incoming4r`);
        dataToCreate.Incoming4rId = incoming.id;
      }
    }

    if (tp === '2R') {
      if (Incoming2rId) {
        dataToCreate.Incoming2rId = Incoming2rId;
      } else {
        const incoming = await this.prisma.incoming2r.findFirst({
          where: { prId: prNo },
        });
        if (!incoming)
          throw new Error(`PR ID ${prNo} tidak ditemukan di Incoming2r`);
        dataToCreate.Incoming2rId = incoming.id;
      }
    }

    const createdEntry = await this.prisma.packingEntry.create({
      data: dataToCreate,
    });

    // Update stock quantity with the new qtyActualPacking as the diff
    await this.updateStock(createdEntry, createdEntry.qtyActualPacking ?? 0);

    return createdEntry;
  }

  private async updateStock(entry: any, qtyDiff: number) {
    try {
      //  console.log(entry);
      if (entry.type === '4R' && entry.Incoming4rId) {
        const allEntries = await this.prisma.packingEntry.findMany({
          where: {
            packingReqNo: entry.packingReqNo,
            type: '4R',
          },
        });

        const totalActual = allEntries.reduce(
          (sum, e) => sum + (e.qtyActualPacking ?? 0),
          0,
        );

        await this.prisma.incoming4r.update({
          where: { id: entry.Incoming4rId },
          data: { qtyActual: totalActual },
        });

        const packingEntry = await this.prisma.packingEntry.findUnique({
          where: { id: entry.id },
          select: { part4rId: true },
        });

        if (packingEntry?.part4rId != null) {
          const existingStock = await this.prisma.stock.findFirst({
            where: {
              part4rId: packingEntry.part4rId,
              part2rId: null,
            },
          });

          if (existingStock) {
            await this.prisma.stock.update({
              where: { id: existingStock.id },
              data: {
                totalStock: {
                  increment: qtyDiff,
                },
                updatedAt: new Date(),
              },
            });
          } else {
            await this.prisma.stock.create({
              data: {
                part4rId: packingEntry.part4rId,
                part2rId: null,
                totalStock: qtyDiff,
                rack: null,
              },
            });
          }
        }
      } else if (entry.type === '2R' && entry.Incoming2rId) {
        const allEntries = await this.prisma.packingEntry.findMany({
          where: {
            packingReqNo: entry.packingReqNo,
            type: '2R',
          },
        });

        const totalActual = allEntries.reduce(
          (sum, e) => sum + (e.qtyActualPacking ?? 0),
          0,
        );

        await this.prisma.incoming2r.update({
          where: { id: entry.Incoming2rId },
          data: { qtyActual: totalActual },
        });

        const packingEntry = await this.prisma.packingEntry.findUnique({
          where: { id: entry.id },
          select: { part2rId: true },
        });

        if (packingEntry?.part2rId != null) {
          const existingStock = await this.prisma.stock.findFirst({
            where: {
              part2rId: packingEntry.part2rId,
              part4rId: null,
            },
          });

          if (existingStock) {
            await this.prisma.stock.update({
              where: { id: existingStock.id },
              data: {
                totalStock: {
                  increment: qtyDiff,
                },
                updatedAt: new Date(),
              },
            });
          } else {
            await this.prisma.stock.create({
              data: {
                part2rId: packingEntry.part2rId,
                part4rId: null,
                totalStock: qtyDiff,
                rack: null,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      throw new Error('Failed to update stock records');
    }
  }

  async updateStatus(id: number, status: Status) {
    return this.prisma.packingEntry.update({
      where: { id },
      data: { status },
    });
  }

  async approveGrouped(id: number) {
    const entry = await this.prisma.packingEntry.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        packingReqNo: true,
        Incoming2rId: true,
        Incoming4rId: true,
        packingReportId: true,
      },
    });

    if (!entry) throw new Error(`Entry dengan id ${id} tidak ditemukan`);

    // Get All Entry
    const allSamePR = await this.prisma.packingEntry.findMany({
      where: {
        packingReqNo: entry.packingReqNo,
        type: entry.type,
      },
    });

    const totalActual = allSamePR.reduce(
      (sum, e) => sum + (e.qtyActualPacking ?? 0),
      0,
    );

    const plan = allSamePR[0].qtyPlan ?? 0;

    if (totalActual >= plan) {
      // Approve All Entry
      await this.prisma.packingEntry.updateMany({
        where: {
          packingReqNo: entry.packingReqNo,
          type: entry.type,
        },
        data: { status: Status.APPROVED },
      });

      const totalPlan = allSamePR[0].qtyPlan ?? 0;

      if (totalActual >= totalPlan) {
        if (entry.type === '4R' && entry.Incoming4rId) {
          await this.prisma.incoming4r.update({
            where: { id: entry.Incoming4rId },
            data: {
              status: Status.APPROVED,
              qtyActual: totalActual,
            },
          });
        } else if (entry.type === '2R' && entry.Incoming2rId) {
          await this.prisma.incoming2r.update({
            where: { id: entry.Incoming2rId },
            data: {
              status: Status.APPROVED,
              qtyActual: totalActual,
            },
          });
        }
      }

      // Get All Report
      const affectedReportIds = [
        ...new Set(allSamePR.map((e) => e.packingReportId)),
      ];

      for (const reportId of affectedReportIds) {
        const entriesInReport = await this.prisma.packingEntry.findMany({
          where: { packingReportId: reportId },
        });

        const allFinal = entriesInReport.every(
          (e) => e.status === Status.APPROVED || e.status === Status.REJECTED,
        );

        if (allFinal) {
          const allApproved = entriesInReport.every(
            (e) => e.status === Status.APPROVED,
          );

          await this.prisma.packingReport.update({
            where: { id: reportId },
            data: {
              status: allApproved ? Status.APPROVED : Status.REJECTED,
            },
          });
        }
      }

      return {
        message: `Semua entry dengan PR ${entry.packingReqNo} berhasil di-APPROVE.`,
        totalActual,
        plan,
      };
    } else {
      return {
        message: `Belum bisa approve. Total actual: ${totalActual}, Plan: ${plan}`,
        totalActual,
        plan,
      };
    }
  }

  async rejectGrouped(id: number) {
    const entry = await this.prisma.packingEntry.findUnique({ where: { id } });

    if (!entry) throw new Error(`Entry dengan id ${id} tidak ditemukan`);

    await this.prisma.packingEntry.updateMany({
      where: {
        packingReqNo: entry.packingReqNo,
        type: entry.type,
      },
      data: { status: Status.REJECTED },
    });

    // Check Status Report
    const entriesInReport = await this.prisma.packingEntry.findMany({
      where: { packingReportId: entry.packingReportId },
    });

    const allFinal = entriesInReport.every(
      (e) => e.status === Status.APPROVED || e.status === Status.REJECTED,
    );

    if (allFinal) {
      const allApproved = entriesInReport.every(
        (e) => e.status === Status.APPROVED,
      );

      await this.prisma.packingReport.update({
        where: { id: entry.packingReportId },
        data: {
          status: allApproved ? Status.APPROVED : Status.REJECTED,
        },
      });
    }

    return {
      message: `Semua entry dengan PR ${entry.packingReqNo} berhasil di-REJECT.`,
    };
  }

  async findAll(page?: number, limit?: number) {
    if (!page || !limit) {
      return this.prisma.packingEntry.findMany({
        take: 500,
        include: { packingReport: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.packingEntry.findMany({
        skip,
        take: limit,
        include: { packingReport: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.packingEntry.count(),
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
    return this.prisma.packingEntry.findUnique({
      where: { id },
      include: { packingReport: true },
    });
  }

  async update(id: number, dto: UpdatePackingEntryDto) {
    // First get the current entry to check its status
    const currentEntry = await this.prisma.packingEntry.findUnique({
      where: { id },
    });

    if (!currentEntry) {
      throw new Error(`Entry dengan id ${id} tidak ditemukan`);
    }

    // Only allow updates if status is PENDING

    //   throw new Error("Hanya entry dengan status PENDING yang bisa diupdate");

    const forbiddenFields = [
      'id',
      'createdAt',
      'updatedAt',
      'Incoming2r',
      'Incoming4r',
      'packingReport',
      'tanggalPacking',
      'lineNo',
      'pic1',
      'pic2',
      'pic3',
    ];

    const data: Record<string, any> = {};

    for (const key of Object.keys(dto)) {
      if (!forbiddenFields.includes(key)) {
        data[key] = (dto as any)[key];
      }
    }

    // Prisma relation handler
    if ('Incoming4rId' in dto) {
      data.Incoming4r = dto.Incoming4rId
        ? { connect: { id: dto.Incoming4rId } }
        : { disconnect: true };
      delete data.Incoming4rId;
    }

    if ('part2rId' in dto) {
      data.part2r = dto.part2rId
        ? { connect: { id: dto.part2rId } }
        : { disconnect: true };
      delete data.part2rId;
    }

    if ('part4rId' in dto) {
      data.part4r = dto.part4rId
        ? { connect: { id: dto.part4rId } }
        : { disconnect: true };
      delete data.part4rId;
    }

    if ('pic1Id' in dto) {
      data.pic1 = dto.pic1Id
        ? { connect: { id: dto.pic1Id } }
        : { disconnect: true };
      delete data.pic1Id;
    }

    if ('pic2Id' in dto) {
      data.pic2 = dto.pic2Id
        ? { connect: { id: dto.pic2Id } }
        : { disconnect: true };
      delete data.pic2Id;
    }

    if ('pic3Id' in dto) {
      data.pic3 = dto.pic3Id
        ? { connect: { id: dto.pic3Id } }
        : { disconnect: true };
      delete data.pic3Id;
    }

    if ('Incoming2rId' in dto) {
      data.Incoming2r = dto.Incoming2rId
        ? { connect: { id: dto.Incoming2rId } }
        : { disconnect: true };
      delete data.Incoming2rId;
    }

    if ('packingReportId' in dto) {
      data.packingReport = dto.packingReportId
        ? { connect: { id: dto.packingReportId } }
        : undefined;
      delete data.packingReportId;
    }

    // Update main entry
    const updated = await this.prisma.packingEntry.update({
      where: { id },
      data,
    });

    // Update stock quantity
    const qtyDiff =
      (updated.qtyActualPacking ?? 0) - (currentEntry.qtyActualPacking ?? 0);
    await this.updateStock(updated, qtyDiff);

    // Check all entries with same PR and type
    const allSamePR = await this.prisma.packingEntry.findMany({
      where: {
        packingReqNo: updated.packingReqNo,
        type: updated.type,
      },
    });

    const totalActual = allSamePR.reduce(
      (sum, e) => sum + (e.qtyActualPacking ?? 0),
      0,
    );
    const plan = allSamePR[0]?.qtyPlan ?? 0;

    // If current quantity is less than plan, reset status to PENDING
    if (totalActual < plan) {
      await this.prisma.packingEntry.updateMany({
        where: {
          packingReqNo: updated.packingReqNo,
          type: updated.type,
        },
        data: { status: Status.PENDING },
      });

      if (updated.type === '4R' && updated.Incoming4rId) {
        await this.prisma.incoming4r.update({
          where: { id: updated.Incoming4rId },
          data: {
            status: Status.PENDING,
            qtyActual: totalActual,
          },
        });
      }

      if (updated.type === '2R' && updated.Incoming2rId) {
        await this.prisma.incoming2r.update({
          where: { id: updated.Incoming2rId },
          data: {
            status: Status.PENDING,
            qtyActual: totalActual,
          },
        });
      }

      // Update related packing report status
      const affectedReportIds = [
        ...new Set(allSamePR.map((e) => e.packingReportId)),
      ];
      for (const reportId of affectedReportIds) {
        await this.prisma.packingReport.update({
          where: { id: reportId },
          data: { status: Status.PENDING },
        });
      }
    }

    return updated;
  }

  //   // First get the current entry to check its status

  //     where: { id },
  //   });

  //     throw new Error(`Entry dengan id ${id} tidak ditemukan`);

  //   // Only allow deletion if status is PENDING

  //     throw new Error('Hanya entry dengan status PENDING yang bisa dihapus');

  //   // Delete the entry

  //     where: { id },
  //   });

  //   // Update stock quantity after deletion

  //   return deletedEntry;

  async remove(id: number) {
    const currentEntry = await this.prisma.packingEntry.findUnique({
      where: { id },
      include: {
        Incoming4r: true,
        Incoming2r: true,
        packingReport: true,
      },
    });

    if (!currentEntry) {
      throw new NotFoundException(`Entry dengan id ${id} tidak ditemukan`);
    }

    if (currentEntry.status !== Status.PENDING) {
      throw new BadRequestException(
        'Hanya entry dengan status PENDING yang bisa dihapus',
      );
    }

    if (!currentEntry.packingReportId) {
      throw new BadRequestException('Packing report tidak valid');
    }

    const qty = currentEntry.qtyActualPacking ?? 0;

    try {
      return await this.prisma.$transaction(async (tx) => {
        if (currentEntry.type === '4R' && currentEntry.Incoming4r) {
          const part = await tx.partDatabase4r.findFirst({
            where: {
              assyNo16: currentEntry.Incoming4r.assyNo16,
              assyNo10: currentEntry.Incoming4r.assyNo10,
              oeNo: currentEntry.Incoming4r.oeNo,
            },
          });

          if (part) {
            await this.adjustStock(tx, {
              part4rId: part.id,
              quantity: -qty,
            });
          }
        }

        if (currentEntry.type === '2R' && currentEntry.Incoming2r) {
          const part = await tx.partDatabase2r.findFirst({
            where: {
              assyNo16: currentEntry.Incoming2r.assyNo16,
              assyNo10: currentEntry.Incoming2r.assyNo10,
              oeNo: currentEntry.Incoming2r.oeNo,
              emiPartName: currentEntry.Incoming2r.EMIpartname,
            },
          });

          if (part) {
            await this.adjustStock(tx, {
              part2rId: part.id,
              quantity: -qty,
            });
          }
        }

        await tx.packingReport.update({
          where: { id: currentEntry.packingReportId },
          data: {
            qty4R: currentEntry.type === '4R' ? { decrement: qty } : undefined,
            qty2R: currentEntry.type === '2R' ? { decrement: qty } : undefined,
          },
        });

        return tx.packingEntry.delete({
          where: { id },
        });
      });
    } catch (err) {
      console.error('DELETE PACKING ENTRY ERROR:', err);
      throw err;
    }
  }

  private async adjustStock(
    tx: Prisma.TransactionClient,
    params: {
      part4rId?: number;
      part2rId?: number;
      quantity: number;
    },
  ) {
    const { part4rId, part2rId, quantity } = params;

    const where = {
      part4rId: part4rId ?? null,
      part2rId: part2rId ?? null,
    };

    const existingStock = await tx.stock.findFirst({ where });

    if (!existingStock) {
      throw new BadRequestException('Stock belum tersedia untuk part ini');
    }

    const newStock = existingStock.totalStock + quantity;

    if (newStock < 0) {
      throw new BadRequestException(
        `Stock tidak boleh minus (stok: ${existingStock.totalStock})`,
      );
    }

    await tx.stock.update({
      where: { id: existingStock.id },
      data: {
        totalStock: newStock,
        updatedAt: new Date(),
      },
    });
  }
}
