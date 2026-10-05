const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting stock recalculation...');

  // 1. Get all parts
  const parts2r = await prisma.partDatabase2r.findMany();
  const parts4r = await prisma.partDatabase4r.findMany();

  console.log(`Found ${parts2r.length} 2R parts and ${parts4r.length} 4R parts.`);

  // 2. Clear all stocks (optional, but recalculating them from scratch guarantees no orphaned stocks)
  await prisma.stock.deleteMany({});
  console.log('Cleared existing stocks.');

  let newStocks = 0;

  // Process 2R parts
  for (const part of parts2r) {
    const incomings = await prisma.packingEntry.aggregate({
      _sum: { qtyActualPacking: true },
      where: { part2rId: part.id },
    });

    const outgoings = await prisma.deliveryItem.aggregate({
      _sum: { qtyDelivered: true },
      where: { part2rId: part.id },
    });

    const totalIn = incomings._sum.qtyActualPacking || 0;
    const totalOut = outgoings._sum.qtyDelivered || 0;
    const currentStock = totalIn - totalOut;

    if (totalIn > 0 || totalOut > 0) {
      await prisma.stock.create({
        data: {
          part2rId: part.id,
          totalStock: currentStock,
        },
      });
      newStocks++;
    }
  }

  // Process 4R parts
  for (const part of parts4r) {
    const incomings = await prisma.packingEntry.aggregate({
      _sum: { qtyActualPacking: true },
      where: { part4rId: part.id },
    });

    const outgoings = await prisma.deliveryItem.aggregate({
      _sum: { qtyDelivered: true },
      where: { part4rId: part.id },
    });

    const totalIn = incomings._sum.qtyActualPacking || 0;
    const totalOut = outgoings._sum.qtyDelivered || 0;
    const currentStock = totalIn - totalOut;

    if (totalIn > 0 || totalOut > 0) {
      await prisma.stock.create({
        data: {
          part4rId: part.id,
          totalStock: currentStock,
        },
      });
      newStocks++;
    }
  }

  console.log(`Successfully recalculated ${newStocks} stock records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
