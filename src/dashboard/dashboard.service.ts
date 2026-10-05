import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // Format: dd/MM/yyyy
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private getPlanDates(today: Date): string[] {
    const day = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const dates: Date[] = [];

    const clone = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());

    switch (day) {
      case 1: // Monday
        const friday = new Date(today);
        friday.setDate(today.getDate() - 3); // Friday
        dates.push(clone(friday), clone(today));
        break;
      case 2:
      case 3:
      case 4:
      case 5: // Tue–Fri
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        dates.push(clone(yesterday), clone(today));
        break;
      default:
        break; // Weekend
    }

    return dates.map((d) => this.formatDate(d));
  }

  async findAll() {
    const now = new Date();
    const todayStr = this.formatDate(now);

    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    const dateTwoDaysAgoStr = this.formatDate(twoDaysAgo);

    const planDates = this.getPlanDates(now);

    if (planDates.length === 0) {
      return {
        data2r: { plan2r: 0, notDone: 0 },
        data4r: { plan4r: 0, notDone: 0 },
      };
    }

    // Cari tanggal plan paling awal (untuk batasan carry)
    const [d, m, y] = planDates[0].split('/').map(Number);
    const earliestPlanDate = new Date(y, m - 1, d);
    const earliestPlanDateStr = this.formatDate(earliestPlanDate);

    // ======== CARRY: hanya data sebelum earliest plan date ========
    const carry2r = await this.prisma.incoming2r.findMany({
      where: {
        date: {
          lt: earliestPlanDateStr,
        },
      },
      include: {
        packingEntries: true,
      },
    });

    const carry4r = await this.prisma.incoming4r.findMany({
      where: {
        date: {
          lt: earliestPlanDateStr,
        },
      },
      include: {
        packingEntries: true,
      },
    });

    const mappedCarry2r = carry2r.map((i) => ({
      ...i,
      done: i.packingEntries.reduce(
        (sum, entry) => sum + entry.qtyActualPacking,
        0,
      ),
    }));

    const mappedCarry4r = carry4r.map((i) => ({
      ...i,
      done: i.packingEntries.reduce(
        (sum, entry) => sum + entry.qtyActualPacking,
        0,
      ),
    }));

    const totalPlanCarry2r = mappedCarry2r.reduce(
      (sum, item) => sum + item.qtyPlan,
      0,
    );
    const totalDoneCarry2r = mappedCarry2r.reduce(
      (sum, item) => sum + item.done,
      0,
    );
    const totalNotDone2r = Math.max(0, totalPlanCarry2r - totalDoneCarry2r); // ✅ tidak boleh minus

    const totalPlanCarry4r = mappedCarry4r.reduce(
      (sum, item) => sum + item.qtyPlan,
      0,
    );
    const totalDoneCarry4r = mappedCarry4r.reduce(
      (sum, item) => sum + item.done,
      0,
    );
    const totalNotDone4r = Math.max(0, totalPlanCarry4r - totalDoneCarry4r); // ✅ tidak boleh minus

    // ======== PLAN: untuk hari ini & kemarin (planDates) ========
    const incoming2rToday = await this.prisma.incoming2r.findMany({
      where: {
        date: {
          in: planDates,
        },
      },
      select: {
        qtyPlan: true,
      },
    });

    const incoming4rToday = await this.prisma.incoming4r.findMany({
      where: {
        date: {
          in: planDates,
        },
      },
      select: {
        qtyPlan: true,
      },
    });

    const totalPlan2r = incoming2rToday.reduce(
      (sum, item) => sum + item.qtyPlan,
      0,
    );
    const totalPlan4r = incoming4rToday.reduce(
      (sum, item) => sum + item.qtyPlan,
      0,
    );

    // ======== OPSIONAL: tampilkan 2 hari lalu ========
    const inc2r = await this.prisma.incoming2r.findMany({
      where: {
        date: dateTwoDaysAgoStr,
      },
      include: {
        packingEntries: true,
      },
    });

    const inc4r = await this.prisma.incoming4r.findMany({
      where: {
        date: dateTwoDaysAgoStr,
      },
      include: {
        packingEntries: true,
      },
    });

    const mapped2r = inc2r.map((i) => ({
      ...i,
      done: i.packingEntries.reduce(
        (sum, entry) => sum + entry.qtyActualPacking,
        0,
      ),
    }));

    const mapped4r = inc4r.map((i) => ({
      ...i,
      done: i.packingEntries.reduce(
        (sum, entry) => sum + entry.qtyActualPacking,
        0,
      ),
    }));

    return {
      data2r: {
        plan2r: totalPlan2r,
        notDone: totalNotDone2r,
      },
      data4r: {
        plan4r: totalPlan4r,
        notDone: totalNotDone4r,
      },
    };
  }
}
