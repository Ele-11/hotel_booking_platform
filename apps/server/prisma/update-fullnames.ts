import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAdminFullNames() {
  // 更新3个管理员账号的全名
  const updates = [
    {
      email: 'admin1@hotelbooking.com',
      fullName: '邓祥宇',
      password: 'Admin123456'
    },
    {
      email: 'admin2@hotelbooking.com',
      fullName: '张毓欣',
      password: 'Admin123456'
    },
    {
      email: 'admin3@hotelbooking.com',
      fullName: '张扬',
      password: 'Admin123456'
    }
  ];

  for (const updateData of updates) {
    try {
      const updatedUser = await prisma.user.update({
        where: { email: updateData.email },
        data: {
          fullName: updateData.fullName
        }
      });
      
      console.log(`管理员账号更新成功: ${updatedUser.email} -> ${updatedUser.fullName}`);
    } catch (error) {
      console.error(`更新管理员账号失败 (${updateData.email}):`, error);
    }
  }
}

updateAdminFullNames()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });