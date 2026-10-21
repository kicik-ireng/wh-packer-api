import { PrismaClient } from '@prisma/client';
import { PACKER_PERMISSIONS } from '../src/common/permissions.constant';

const prisma = new PrismaClient();
const SYSTEM = 'System';

async function main() {
  console.log('Seeding WH Packer permissions and roles...');

  // 1. Seed Permissions
  for (const action of PACKER_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { Action: action },
      update: { UpdatedBy: SYSTEM },
      create: {
        Action: action,
        Description: action.replace('PACKER.', '').replace(/_/g, ' '),
        CreatedBy: SYSTEM,
        UpdatedBy: SYSTEM,
      },
    });
  }

  const allPermissions = await prisma.permission.findMany({
    where: { Action: { in: [...PACKER_PERMISSIONS] } },
    select: { Id: true },
  });

  // 2. Seed Role: admin (with all permissions)
  await prisma.role.upsert({
    where: { RoleName: 'admin' },
    update: {
      IsActive: true,
      UpdatedBy: SYSTEM,
      Permissions: { set: allPermissions.map(({ Id }) => ({ Id })) },
    },
    create: {
      RoleName: 'admin',
      Description: 'Full system administrator privileges',
      IsActive: true,
      CreatedBy: SYSTEM,
      UpdatedBy: SYSTEM,
      Permissions: { connect: allPermissions.map(({ Id }) => ({ Id })) },
    },
  });

  // 3. Seed Role: none (default role, empty permissions by default)
  await prisma.role.upsert({
    where: { RoleName: 'none' },
    update: {
      IsActive: true,
      UpdatedBy: SYSTEM,
    },
    create: {
      RoleName: 'none',
      Description: 'Standard user role without elevated privileges',
      IsActive: true,
      CreatedBy: SYSTEM,
      UpdatedBy: SYSTEM,
    },
  });

  console.log('WH Packer permissions and roles seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
