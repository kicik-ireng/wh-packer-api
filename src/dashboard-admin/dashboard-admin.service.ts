import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardAdminService {
  private readonly logger = new Logger(DashboardAdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAdminDashboard() {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      // Date for 7 days ago
      const sevenDaysAgo = new Date(startOfDay);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      // 1. Parallel queries for aggregated KPI metrics
      const [
        totalPart2R,
        totalPart4R,
        stocks2R,
        stocks4R,
        todayDandori,
        todayPackingReports,
        todayDeliveryOrders,
        openProblems,
        todayProblems,
        pendingOpnames,
        recentPackingEntries,
        recentProblemsList,
        recentDeliveryList,
        trendPackingReports,
        trendDeliveryOrders,
      ] = await Promise.all([
        // Master part counts
        this.prisma.partDatabase2r.count(),
        this.prisma.partDatabase4r.count(),

        // Stock balances
        this.prisma.stock.findMany({
          where: { part2rId: { not: null } },
          include: { part2r: true },
        }),
        this.prisma.stock.findMany({
          where: { part4rId: { not: null } },
          include: { part4r: true },
        }),

        // Today's Dandori schedules
        this.prisma.dandoriPackingSchedule.findMany({
          where: {
            scheduleDate: { gte: startOfDay, lte: endOfDay },
          },
          include: { pic1: true, pic2: true, pic3: true },
        }),

        // Today's Packing Reports & Entries
        this.prisma.packingReport.findMany({
          where: {
            tanggalPacking: { gte: startOfDay, lte: endOfDay },
          },
          include: {
            entries: true,
            pic1: true,
            pic2: true,
            pic3: true,
          },
        }),

        // Today's Delivery Orders
        this.prisma.deliveryOrder.findMany({
          where: {
            date: { gte: startOfDay, lte: endOfDay },
          },
          include: {
            items: true,
            driver: true,
            customer: true,
          },
        }),

        // All Open Production Problems
        this.prisma.productionProblemReport.findMany({
          where: {
            status: { notIn: ['RESOLVED', 'CLOSED', 'SELESAI'] },
          },
        }),

        // Problems recorded today
        this.prisma.productionProblemReport.findMany({
          where: {
            createdAt: { gte: startOfDay, lte: endOfDay },
          },
        }),

        // Pending Stock Opnames
        this.prisma.stockOpname.count({
          where: { status: 'PENDING' },
        }),

        // Latest Packing Entries (Recent activity)
        this.prisma.packingEntry.findMany({
          take: 8,
          orderBy: { createdAt: 'desc' },
          include: {
            packingReport: {
              include: { pic1: true, pic2: true, pic3: true },
            },
          },
        }),

        // Latest Problems
        this.prisma.productionProblemReport.findMany({
          take: 6,
          orderBy: { createdAt: 'desc' },
        }),

        // Latest Delivery Orders
        this.prisma.deliveryOrder.findMany({
          take: 6,
          orderBy: { date: 'desc' },
          include: {
            driver: true,
            customer: true,
            items: true,
          },
        }),

        // 7-day packing reports for trend
        this.prisma.packingReport.findMany({
          where: {
            tanggalPacking: { gte: sevenDaysAgo, lte: endOfDay },
          },
          include: { entries: true },
        }),

        // 7-day delivery orders for trend
        this.prisma.deliveryOrder.findMany({
          where: {
            date: { gte: sevenDaysAgo, lte: endOfDay },
          },
          include: { items: true, customer: true },
        }),
      ]);

      // Calculate Stock KPIs
      const totalStock2R = stocks2R.reduce((sum, s) => sum + (s.totalStock || 0), 0);
      const totalStock4R = stocks4R.reduce((sum, s) => sum + (s.totalStock || 0), 0);
      const totalStock = totalStock2R + totalStock4R;

      const outOfStockCount =
        stocks2R.filter((s) => (s.totalStock || 0) <= 0).length +
        stocks4R.filter((s) => (s.totalStock || 0) <= 0).length;

      const lowStockCount =
        stocks2R.filter((s) => (s.totalStock || 0) > 0 && (s.totalStock || 0) < 50).length +
        stocks4R.filter((s) => (s.totalStock || 0) > 0 && (s.totalStock || 0) < 50).length;

      // Calculate Dandori & Packing KPIs
      const activeLinesSet = new Set<string>();
      let todayDandoriPlan = 0;
      let todayDandoriActual = 0;

      for (const d of todayDandori) {
        if (d.lineNo) activeLinesSet.add(d.lineNo);
        todayDandoriPlan += d.qtyPlan || 0;
        todayDandoriActual += d.qtyActual || 0;
      }

      let todayPacked2R = 0;
      let todayPacked4R = 0;
      let todayPackingEntriesCount = 0;

      for (const rep of todayPackingReports) {
        if (rep.lineNo) activeLinesSet.add(rep.lineNo);
        for (const ent of rep.entries) {
          todayPackingEntriesCount += 1;
          const qty = ent.qtyActualPacking || 0;
          if (ent.type === '4R') {
            todayPacked4R += qty;
          } else {
            todayPacked2R += qty;
          }
        }
      }

      const todayPackedTotal = todayPacked2R + todayPacked4R;
      const effectivePlan = todayDandoriPlan > 0 ? todayDandoriPlan : todayPackedTotal;
      const fulfillmentRate =
        effectivePlan > 0
          ? Math.min(100, Number(((todayPackedTotal / effectivePlan) * 100).toFixed(1)))
          : 100;

      // Delivery KPIs
      let todayDeliveredQty = 0;
      for (const doItem of todayDeliveryOrders) {
        for (const it of doItem.items) {
          todayDeliveredQty += it.qtyDelivered || 0;
        }
      }

      // Downtime KPIs
      const todayDowntimeMinutes = todayProblems.reduce((sum, p) => sum + (p.menit || 0), 0);

      // Build 7-day trend
      const trendDays: {
        date: string;
        label: string;
        dayName: string;
        packed2R: number;
        packed4R: number;
        packedTotal: number;
        deliveredQty: number;
      }[] = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        const label = `${dd}/${mm}`;
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const dayName = dayNames[d.getDay()];

        // Sum packing for this day
        let dayPacked2R = 0;
        let dayPacked4R = 0;
        for (const rep of trendPackingReports) {
          const repDate = new Date(rep.tanggalPacking);
          const repKey = `${repDate.getFullYear()}-${String(repDate.getMonth() + 1).padStart(2, '0')}-${String(repDate.getDate()).padStart(2, '0')}`;
          if (repKey === dateKey) {
            for (const ent of rep.entries) {
              if (ent.type === '4R') {
                dayPacked4R += ent.qtyActualPacking || 0;
              } else {
                dayPacked2R += ent.qtyActualPacking || 0;
              }
            }
          }
        }

        // Sum delivery for this day
        let dayDelivered = 0;
        for (const dOrd of trendDeliveryOrders) {
          const dOrdDate = new Date(dOrd.date);
          const dOrdKey = `${dOrdDate.getFullYear()}-${String(dOrdDate.getMonth() + 1).padStart(2, '0')}-${String(dOrdDate.getDate()).padStart(2, '0')}`;
          if (dOrdKey === dateKey) {
            for (const it of dOrd.items) {
              dayDelivered += it.qtyDelivered || 0;
            }
          }
        }

        trendDays.push({
          date: dateKey,
          label,
          dayName,
          packed2R: dayPacked2R,
          packed4R: dayPacked4R,
          packedTotal: dayPacked2R + dayPacked4R,
          deliveredQty: dayDelivered,
        });
      }

      // Stock Distribution by Top Items
      const stockItemsMapped = [
        ...stocks2R.map((s) => ({
          name: s.part2r?.assyNo16 || s.part2r?.codeNo || `2R Part #${s.part2rId}`,
          code: s.part2r?.oeNo || s.part2r?.codeNo || '—',
          type: '2R',
          total: s.totalStock || 0,
        })),
        ...stocks4R.map((s) => ({
          name: s.part4r?.assyNo16 || s.part4r?.codeNo || `4R Part #${s.part4rId}`,
          code: s.part4r?.oeNo || s.part4r?.codeNo || '—',
          type: '4R',
          total: s.totalStock || 0,
        })),
      ]
        .sort((a, b) => b.total - a.total)
        .slice(0, 6);

      const topStockDistribution = stockItemsMapped.map((item) => ({
        Name: item.name,
        Code: item.code,
        Type: item.type,
        Total: item.total,
      }));

      // Top Customers by delivery order count
      const customerCounts: Record<string, number> = {};
      for (const dOrd of trendDeliveryOrders) {
        const cName = dOrd.customer?.name || 'Lainnya';
        customerCounts[cName] = (customerCounts[cName] || 0) + 1;
      }
      const customerDistribution = Object.entries(customerCounts)
        .map(([Name, Total]) => ({ Name, Total }))
        .sort((a, b) => b.Total - a.Total)
        .slice(0, 5);

      return {
        kpi: {
          totalPart2R,
          totalPart4R,
          totalParts: totalPart2R + totalPart4R,
          totalStock2R,
          totalStock4R,
          totalStock,
          outOfStockCount,
          lowStockCount,
          todayPacked2R,
          todayPacked4R,
          todayPackedTotal,
          todayPlanTotal: effectivePlan,
          fulfillmentRate,
          activeLinesCount: activeLinesSet.size,
          totalLines: 8,
          todayDeliveryCount: todayDeliveryOrders.length,
          todayDeliveredQty,
          openProblemsCount: openProblems.length,
          todayDowntimeMinutes,
          pendingOpnamesCount: pendingOpnames,
        },
        priority: [
          {
            key: 'openProblems',
            label: 'Kendala Produksi Aktif',
            detail: `${openProblems.length} kendala belum selesai`,
            value: openProblems.length,
            tone: openProblems.length > 0 ? 'danger' : 'neutral',
          },
          {
            key: 'outOfStock',
            label: 'Stok Kosong (Zero Stock)',
            detail: `${outOfStockCount} part stok 0`,
            value: outOfStockCount,
            tone: outOfStockCount > 0 ? 'danger' : 'neutral',
          },
          {
            key: 'lowStock',
            label: 'Stok Kritis (< 50 pcs)',
            detail: `${lowStockCount} part perlu diisi`,
            value: lowStockCount,
            tone: lowStockCount > 0 ? 'warning' : 'neutral',
          },
          {
            key: 'pendingOpnames',
            label: 'Stock Opname Pending',
            detail: `${pendingOpnames} audit menunggu persetujuan`,
            value: pendingOpnames,
            tone: pendingOpnames > 0 ? 'warning' : 'neutral',
          },
          {
            key: 'deliveriesToday',
            label: 'Pengiriman Hari Ini',
            detail: `${todayDeliveryOrders.length} Surat Jalan / DO`,
            value: todayDeliveryOrders.length,
            tone: 'neutral',
          },
          {
            key: 'activeLines',
            label: 'Line Packing Berjalan',
            detail: `${activeLinesSet.size} dari 8 line beroperasi`,
            value: activeLinesSet.size,
            tone: 'neutral',
          },
        ],
        trends: trendDays,
        stockDistribution: topStockDistribution,
        customerDistribution,
        recentPacking: recentPackingEntries.map((e) => ({
          id: e.id,
          lineNo: e.packingReport?.lineNo || '—',
          packingReqNo: e.packingReqNo,
          customerPartNo: e.customerPartNo || '—',
          explannerNo: e.explannerNo || '—',
          type: e.type,
          qtyPlan: e.qtyPlan,
          qtyActualPacking: e.qtyActualPacking,
          jamMulai: e.jamMulai,
          jamSelesai: e.jamSelesai,
          status: e.status,
          pic: [
            e.packingReport?.pic1?.name,
            e.packingReport?.pic2?.name,
            e.packingReport?.pic3?.name,
          ]
            .filter(Boolean)
            .join(', ') || '—',
          createdAt: e.createdAt,
        })),
        recentProblems: recentProblemsList.map((p) => ({
          id: p.id,
          problemItem: p.problemItem,
          pic: p.pic,
          menit: p.menit,
          slOrDl: p.slOrDl,
          status: p.status,
          keterangan: p.keterangan || '—',
          createdAt: p.createdAt,
        })),
        recentDeliveries: recentDeliveryList.map((d) => ({
          id: d.id,
          noDo: d.noDo,
          customer: d.customer?.name || '—',
          driver: d.driver?.name || '—',
          itemCount: d.items.length,
          totalQty: d.items.reduce((s, it) => s + (it.qtyDelivered || 0), 0),
          date: d.date,
        })),
      };
    } catch (error: any) {
      this.logger.error('Error computing admin dashboard:', error);
      throw new InternalServerErrorException(
        error?.message || 'Gagal menghitung data dashboard admin',
      );
    }
  }
}
