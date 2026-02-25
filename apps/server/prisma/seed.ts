import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdminUsers() {
  const saltRounds = 10;
  
  // 创建3个管理员账号
  const adminUsers = [
    {
      email: 'admin1@hotelbooking.com',
      username: 'admin1',
      fullName: '邓祥宇',
      password: 'Admin123456',
      role: UserRole.ADMIN
    },
    {
      email: 'admin2@hotelbooking.com',
      username: 'admin2',
      fullName: '张毓欣',
      password: 'Admin123456',
      role: UserRole.ADMIN
    },
    {
      email: 'admin3@hotelbooking.com',
      username: 'admin3',
      fullName: '张扬',
      password: 'Admin123456',
      role: UserRole.ADMIN
    }
  ];

  for (const userData of adminUsers) {
    try {
      // 检查用户是否已存在
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        await prisma.user.create({
          data: {
            email: userData.email,
            username: userData.username,
            fullName: userData.fullName,
            password: hashedPassword,
            role: userData.role,
            status: 'ACTIVE'
          }
        });
        
        console.log(`管理员账号创建成功: ${userData.email}`);
      } else {
        console.log(`管理员账号已存在: ${userData.email}`);
      }
    } catch (error) {
      console.error(`创建管理员账号失败 (${userData.email}):`, error);
    }
  }
}

seedAdminUsers()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });