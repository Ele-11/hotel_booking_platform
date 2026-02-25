import { PrismaClient, UserRole, UserStatus, HotelStatus, BookingStatus, PaymentStatus, AttractionType, PaymentMethod } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedCompleteData() {
  const saltRounds = 10;

  console.log('开始填充数据库...');

  // 1. 创建管理员用户
  console.log('创建管理员用户...');
  const adminPassword = 'Admin123456';
  const adminUsers = [
    {
      email: 'admin1@hotelbooking.com',
      username: 'admin1',
      fullName: '邓祥宇',
      password: adminPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE
    },
    {
      email: 'admin2@hotelbooking.com',
      username: 'admin2',
      fullName: '张毓欣',
      password: adminPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE
    },
    {
      email: 'admin3@hotelbooking.com',
      username: 'admin3',
      fullName: '张扬',
      password: adminPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE
    }
  ];

  for (const userData of adminUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword
        }
      });
      console.log(`管理员账号创建成功: ${userData.email}`);
    } else {
      console.log(`管理员账号已存在: ${userData.email}`);
    }
  }

  // 2. 创建商户用户
  console.log('创建商户用户...');
  const merchantPassword = 'Merchant123456';
  const merchants = [
    {
      email: 'merchant1@hotelbooking.com',
      username: 'merchant1',
      fullName: '张老板',
      password: merchantPassword,
      role: UserRole.MERCHANT,
      status: UserStatus.ACTIVE,
      companyName: '张氏酒店管理有限公司'
    },
    {
      email: 'merchant2@hotelbooking.com',
      username: 'merchant2',
      fullName: '李老板',
      password: merchantPassword,
      role: UserRole.MERCHANT,
      status: UserStatus.ACTIVE,
      companyName: '李氏酒店集团'
    },
    {
      email: 'merchant3@hotelbooking.com',
      username: 'merchant3',
      fullName: '王老板',
      password: merchantPassword,
      role: UserRole.MERCHANT,
      status: UserStatus.ACTIVE,
      companyName: '王氏酒店投资公司'
    }
  ];

  const merchantRecords = [];
  for (const userData of merchants) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    let merchantRecord;
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      merchantRecord = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword
        }
      });
      
      // 创建商户额外信息
      await prisma.merchant.create({
        data: {
          userId: merchantRecord.id,
          companyName: userData.companyName,
          businessLicense: `BL${merchantRecord.id.substring(0, 8).toUpperCase()}`,
          taxId: `TX${merchantRecord.id.substring(0, 10).toUpperCase()}`
        }
      });
      
      console.log(`商户账号创建成功: ${userData.email}`);
    } else {
      merchantRecord = existingUser;
      console.log(`商户账号已存在: ${userData.email}`);
    }
    merchantRecords.push(merchantRecord);
  }

  // 3. 创建普通用户
  console.log('创建普通用户...');
  const customerPassword = 'Customer123456';
  const customers = [
    {
      email: 'customer1@hotelbooking.com',
      username: 'customer1',
      fullName: '张三',
      password: customerPassword,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE
    },
    {
      email: 'customer2@hotelbooking.com',
      username: 'customer2',
      fullName: '李四',
      password: customerPassword,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE
    },
    {
      email: 'customer3@hotelbooking.com',
      username: 'customer3',
      fullName: '王五',
      password: customerPassword,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE
    },
    {
      email: 'customer4@hotelbooking.com',
      username: 'customer4',
      fullName: '赵六',
      password: customerPassword,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE
    },
    {
      email: 'customer5@hotelbooking.com',
      username: 'customer5',
      fullName: '孙七',
      password: customerPassword,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE
    }
  ];

  for (const userData of customers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword
        }
      });
      console.log(`普通用户创建成功: ${userData.email}`);
    } else {
      console.log(`普通用户已存在: ${userData.email}`);
    }
  }

  // 4. 创建酒店数据
  console.log('创建酒店数据...');
  
  // 为每个商户创建不同城市的酒店
  const hotelsByMerchant = [
    // 张老板的酒店 - 北京、上海
    {
      ownerId: merchantRecords[0].id,
      hotels: [
        {
          name: '北京国贸大酒店',
          englishName: 'Beijing Guomao Grand Hotel',
          description: '位于北京CBD核心区域的五星级商务酒店，毗邻国贸商城，交通便利，设施齐全，是商务出行的理想选择。',
          starRating: 5,
          address: '北京市朝阳区建国门外大街1号',
          city: '北京',
          country: '中国',
          contactPhone: '+86-10-85651234',
          contactEmail: 'beijing.guomao@hotelbooking.com',
          amenities: ['免费WiFi', '健身房', '室内游泳池', '商务中心', '会议室', '中西餐厅', '停车场', '机场接送'],
          tags: ['商务', '豪华', '市中心', '会议室'],
          images: [
            'https://picsum.photos/seed/beijing-guomao-1/800/600.jpg',
            'https://picsum.photos/seed/beijing-guomao-2/800/600.jpg',
            'https://picsum.photos/seed/beijing-guomao-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        },
        {
          name: '上海外滩华尔道夫酒店',
          englishName: 'Waldorf Astoria Shanghai on the Bund',
          description: '坐拥外滩绝佳江景的奢华酒店，融合了古典与现代设计，提供无与伦比的住宿体验。',
          starRating: 5,
          address: '上海市黄浦区中山东一路2号',
          city: '上海',
          country: '中国',
          contactPhone: '+86-21-63229988',
          contactEmail: 'shanghai.bund@hotelbooking.com',
          amenities: ['免费WiFi', '健身房', '室外游泳池', '水疗中心', '中西餐厅', '酒吧', '行政酒廊', '停车场'],
          tags: ['豪华', '江景', '浪漫', '商务'],
          images: [
            'https://picsum.photos/seed/shanghai-bund-1/800/600.jpg',
            'https://picsum.photos/seed/shanghai-bund-2/800/600.jpg',
            'https://picsum.photos/seed/shanghai-bund-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        },
        {
          name: '北京王府井希尔顿酒店',
          englishName: 'Hilton Beijing Wangfujing',
          description: '位于北京繁华的王府井商业区，步行可达故宫和天安门广场，是商务和休闲旅客的理想选择。',
          starRating: 5,
          address: '北京市东城区王府井东街8号',
          city: '北京',
          country: '中国',
          contactPhone: '+86-10-58128888',
          contactEmail: 'beijing.wangfujing@hotelbooking.com',
          amenities: ['免费WiFi', '健身房', '室内游泳池', '商务中心', '中西餐厅', '停车场', '机场接送'],
          tags: ['商务', '市中心', '购物'],
          images: [
            'https://picsum.photos/seed/beijing-wangfujing-1/800/600.jpg',
            'https://picsum.photos/seed/beijing-wangfujing-2/800/600.jpg',
            'https://picsum.photos/seed/beijing-wangfujing-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        }
      ]
    },
    // 李老板的酒店 - 三亚、成都、西安
    {
      ownerId: merchantRecords[1].id,
      hotels: [
        {
          name: '三亚亚特兰蒂斯度假酒店',
          englishName: 'Atlantis Sanya Resort',
          description: '位于海棠湾的海滨度假胜地，拥有私人海滩、水世界和海豚湾，是家庭度假的理想选择。',
          starRating: 5,
          address: '海南省三亚市海棠区海棠北路36号',
          city: '三亚',
          country: '中国',
          contactPhone: '+86-898-88612345',
          contactEmail: 'sanya.atlantis@hotelbooking.com',
          amenities: ['免费WiFi', '健身房', '室外游泳池', '私人海滩', '水世界', '海豚湾', '中西餐厅', '儿童俱乐部', '停车场'],
          tags: ['度假', '海滨', '家庭游', '豪华'],
          images: [
            'https://picsum.photos/seed/sanya-atlantis-1/800/600.jpg',
            'https://picsum.photos/seed/sanya-atlantis-2/800/600.jpg',
            'https://picsum.photos/seed/sanya-atlantis-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        },
        {
          name: '成都宽窄巷子精品酒店',
          englishName: 'Chengdu Kuanzhai Alley Boutique Hotel',
          description: '位于成都著名的历史文化街区宽窄巷子旁，融合传统川西建筑风格与现代舒适设施。',
          starRating: 4,
          address: '四川省成都市青羊区宽窄巷子子街28号',
          city: '成都',
          country: '中国',
          contactPhone: '+86-28-86245678',
          contactEmail: 'chengdu.kuanzhai@hotelbooking.com',
          amenities: ['免费WiFi', '茶室', '川菜餐厅', '传统庭院', '文化体验区', '停车场'],
          tags: ['精品', '文化', '市中心', '传统'],
          images: [
            'https://picsum.photos/seed/chengdu-kuanzhai-1/800/600.jpg',
            'https://picsum.photos/seed/chengdu-kuanzhai-2/800/600.jpg',
            'https://picsum.photos/seed/chengdu-kuanzhai-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        },
        {
          name: '西安大唐不夜城酒店',
          englishName: "Xi'an Datang Everbright City Hotel",
          description: '坐落在大雁塔北广场，毗邻大唐不夜城，可步行至大雁塔和陕西历史博物馆。',
          starRating: 4,
          address: '陕西省西安市雁塔区雁塔南路10号',
          city: '西安',
          country: '中国',
          contactPhone: '+86-29-87654321',
          contactEmail: 'xian.datang@hotelbooking.com',
          amenities: ['免费WiFi', '健身房', '中餐厅', '唐文化体验区', '会议室', '停车场'],
          tags: ['文化', '历史', '市中心'],
          images: [
            'https://picsum.photos/seed/xian-datang-1/800/600.jpg',
            'https://picsum.photos/seed/xian-datang-2/800/600.jpg',
            'https://picsum.photos/seed/xian-datang-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        },
        {
          name: '三亚海棠湾康莱德酒店',
          englishName: 'Conrad Sanya Haitang Bay',
          description: '位于海棠湾的奢华度假酒店，拥有私人海滩和无边泳池，提供极致的度假体验。',
          starRating: 5,
          address: '海南省三亚市海棠区海棠湾路28号',
          city: '三亚',
          country: '中国',
          contactPhone: '+86-898-88889999',
          contactEmail: 'sanya.conrad@hotelbooking.com',
          amenities: ['免费WiFi', '健身房', '室外游泳池', '私人海滩', '无边泳池', '水疗中心', '中西餐厅', '酒吧', '儿童俱乐部'],
          tags: ['度假', '海滨', '豪华', '浪漫'],
          images: [
            'https://picsum.photos/seed/sanya-conrad-1/800/600.jpg',
            'https://picsum.photos/seed/sanya-conrad-2/800/600.jpg',
            'https://picsum.photos/seed/sanya-conrad-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        }
      ]
    },
    // 王老板的酒店 - 杭州、南京
    {
      ownerId: merchantRecords[2].id,
      hotels: [
        {
          name: '杭州西湖四季酒店',
          englishName: 'Four Seasons Hotel Hangzhou at West Lake',
          description: '坐拥西湖美景的奢华酒店，融合江南园林设计，提供宁静优雅的住宿体验。',
          starRating: 5,
          address: '浙江省杭州市西湖区灵隐路5号',
          city: '杭州',
          country: '中国',
          contactPhone: '+86-571-87998888',
          contactEmail: 'hangzhou.westlake@hotelbooking.com',
          amenities: ['免费WiFi', '健身房', '室外游泳池', '水疗中心', '中西餐厅', '茶室', '湖景露台', '停车场'],
          tags: ['豪华', '湖景', '园林', '浪漫'],
          images: [
            'https://picsum.photos/seed/hangzhou-westlake-1/800/600.jpg',
            'https://picsum.photos/seed/hangzhou-westlake-2/800/600.jpg',
            'https://picsum.photos/seed/hangzhou-westlake-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        },
        {
          name: '南京夫子庙亚朵酒店',
          englishName: 'Atour Hotel Nanjing Fuzimiao',
          description: '位于南京夫子庙历史文化街区，融合现代设计与传统文化，步行可达秦淮河和夫子庙。',
          starRating: 4,
          address: '江苏省南京市秦淮区建康路258号',
          city: '南京',
          country: '中国',
          contactPhone: '+86-25-86678888',
          contactEmail: 'nanjing.fuzimiao@hotelbooking.com',
          amenities: ['免费WiFi', '健身房', '中餐厅', '茶室', '图书馆', '会议室', '停车场'],
          tags: ['文化', '历史', '市中心', '精品'],
          images: [
            'https://picsum.photos/seed/nanjing-fuzimiao-1/800/600.jpg',
            'https://picsum.photos/seed/nanjing-fuzimiao-2/800/600.jpg',
            'https://picsum.photos/seed/nanjing-fuzimiao-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        },
        {
          name: '杭州钱江新城万豪酒店',
          englishName: 'Hangzhou Marriott Hotel Qianjiang',
          description: '位于杭州钱江新城CBD核心区，坐拥钱塘江景，是商务和休闲旅客的理想选择。',
          starRating: 5,
          address: '浙江省杭州市江干区民心路88号',
          city: '杭州',
          country: '中国',
          contactPhone: '+86-571-89738888',
          contactEmail: 'hangzhou.qianjiang@hotelbooking.com',
          amenities: ['免费WiFi', '健身房', '室内游泳池', '商务中心', '中西餐厅', '行政酒廊', '江景房', '停车场'],
          tags: ['商务', '江景', '市中心', '豪华'],
          images: [
            'https://picsum.photos/seed/hangzhou-qianjiang-1/800/600.jpg',
            'https://picsum.photos/seed/hangzhou-qianjiang-2/800/600.jpg',
            'https://picsum.photos/seed/hangzhou-qianjiang-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        },
        {
          name: '南京新街口苏宁诺富特酒店',
          englishName: 'Novotel Nanjing Xinjiekou Suning',
          description: '位于南京繁华的新街口商业区，毗邻苏宁广场，交通便利，购物方便。',
          starRating: 4,
          address: '江苏省南京市鼓楼区中山路1号',
          city: '南京',
          country: '中国',
          contactPhone: '+86-25-83218888',
          contactEmail: 'nanjing.xinjiekou@hotelbooking.com',
          amenities: ['免费WiFi', '健身房', '室内游泳池', '中西餐厅', '会议室', '停车场'],
          tags: ['商务', '市中心', '购物'],
          images: [
            'https://picsum.photos/seed/nanjing-xinjiekou-1/800/600.jpg',
            'https://picsum.photos/seed/nanjing-xinjiekou-2/800/600.jpg',
            'https://picsum.photos/seed/nanjing-xinjiekou-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        },
        {
          name: '杭州西溪悦榕庄',
          englishName: 'Banyan Tree Hangzhou',
          description: '坐落于杭州西溪湿地旁的奢华度假酒店，融合江南水乡风情与现代奢华设施。',
          starRating: 5,
          address: '浙江省杭州市西湖区紫金港路21号',
          city: '杭州',
          country: '中国',
          contactPhone: '+86-571-89876666',
          contactEmail: 'hangzhou.xixi@hotelbooking.com',
          amenities: ['免费WiFi', '健身房', '室外游泳池', '水疗中心', '中西餐厅', '酒吧', '湿地景观', '停车场'],
          tags: ['度假', '湿地', '奢华', '自然'],
          images: [
            'https://picsum.photos/seed/hangzhou-xixi-1/800/600.jpg',
            'https://picsum.photos/seed/hangzhou-xixi-2/800/600.jpg',
            'https://picsum.photos/seed/hangzhou-xixi-3/800/600.jpg'
          ],
          status: HotelStatus.PUBLISHED
        }
      ]
    }
  ];

  // 创建所有酒店
  const createdHotels = [];
  for (const merchantData of hotelsByMerchant) {
    for (const hotelData of merchantData.hotels) {
      const existingHotel = await prisma.hotel.findFirst({
        where: { name: hotelData.name }
      });

      if (!existingHotel) {
        const createdHotel = await prisma.hotel.create({
          data: {
            ...hotelData,
            ownerId: merchantData.ownerId
          }
        });
        createdHotels.push(createdHotel);
        console.log(`酒店创建成功: ${hotelData.name}`);
      } else {
        createdHotels.push(existingHotel);
        console.log(`酒店已存在: ${hotelData.name}`);
      }
    }
  }

  // 5. 为每个酒店创建房型
  console.log('创建房型数据...');
  for (const hotel of createdHotels) {
    // 根据酒店类型创建不同的房型
    let roomTypes = [];
    
    // 所有酒店都有基础房型
    roomTypes = [
      {
        name: `${hotel.name}标准间`,
        description: '舒适的标准客房，配备基本设施，适合商务和休闲旅客',
        capacity: 2,
        bedType: '双床',
        area: 25,
        amenities: ['空调', '电视', '免费WiFi', '吹风机', '热水壶'],
        images: [
          `https://picsum.photos/seed/${hotel.id}-standard-1/400/300.jpg`,
          `https://picsum.photos/seed/${hotel.id}-standard-2/400/300.jpg`
        ]
      },
      {
        name: `${hotel.name}大床房`,
        description: '宽敞的大床房，提供更舒适的睡眠体验',
        capacity: 2,
        bedType: '大床',
        area: 28,
        amenities: ['空调', '电视', '免费WiFi', '吹风机', '热水壶', '迷你吧'],
        images: [
          `https://picsum.photos/seed/${hotel.id}-deluxe-1/400/300.jpg`,
          `https://picsum.photos/seed/${hotel.id}-deluxe-2/400/300.jpg`
        ]
      }
    ];
    
    // 根据酒店类型添加特殊房型
    if (hotel.starRating === 5) {
      // 五星级酒店添加套房
      roomTypes.push(
        {
          name: `${hotel.name}行政套房`,
          description: '豪华的行政套房，配备独立客厅和办公区域',
          capacity: 2,
          bedType: '大床',
          area: 55,
          amenities: ['空调', '电视', '免费WiFi', '吹风机', '热水壶', '迷你吧', '办公桌', '沙发', '浴缸'],
          images: [
            `https://picsum.photos/seed/${hotel.id}-executive-1/400/300.jpg`,
            `https://picsum.photos/seed/${hotel.id}-executive-2/400/300.jpg`
          ]
        },
        {
          name: `${hotel.name}总统套房`,
          description: '极致奢华的总统套房，提供最顶级的住宿体验',
          capacity: 4,
          bedType: '特大床+沙发床',
          area: 120,
          amenities: ['空调', '电视', '免费WiFi', '吹风机', '热水壶', '迷你吧', '办公桌', '沙发', '浴缸', '按摩浴缸', '独立餐厅', '管家服务'],
          images: [
            `https://picsum.photos/seed/${hotel.id}-presidential-1/400/300.jpg`,
            `https://picsum.photos/seed/${hotel.id}-presidential-2/400/300.jpg`
          ]
        }
      );
    } else {
      // 四星级酒店添加家庭套房
      roomTypes.push({
        name: `${hotel.name}家庭套房`,
        description: '适合家庭入住的宽敞套房，配备儿童友好设施',
        capacity: 4,
        bedType: '大床+上下铺',
        area: 45,
        amenities: ['空调', '电视', '免费WiFi', '吹风机', '热水壶', '儿童玩具', '沙发', '浴缸'],
        images: [
          `https://picsum.photos/seed/${hotel.id}-family-1/400/300.jpg`,
          `https://picsum.photos/seed/${hotel.id}-family-2/400/300.jpg`
        ]
      });
    }
    
    // 根据酒店位置和类型添加特色房型
    if (hotel.city === '三亚' && hotel.name.includes('度假')) {
      // 三亚度假酒店添加海景房
      roomTypes.push({
        name: `${hotel.name}海景房`,
        description: '坐拥壮丽海景的客房，推窗即见碧海蓝天',
        capacity: 2,
        bedType: '大床',
        area: 35,
        amenities: ['空调', '电视', '免费WiFi', '吹风机', '热水壶', '阳台', '浴缸'],
        images: [
          `https://picsum.photos/seed/${hotel.id}-seaview-1/400/300.jpg`,
          `https://picsum.photos/seed/${hotel.id}-seaview-2/400/300.jpg`
        ]
      });
    }
    
    if (hotel.city === '杭州' && (hotel.name.includes('西湖') || hotel.name.includes('西溪'))) {
      // 杭州西湖或西溪酒店添加园景房
      roomTypes.push({
        name: `${hotel.name}园景房`,
        description: '面向园林或湿地的客房，享受宁静的自然环境',
        capacity: 2,
        bedType: '大床',
        area: 32,
        amenities: ['空调', '电视', '免费WiFi', '吹风机', '热水壶', '阳台', '茶具'],
        images: [
          `https://picsum.photos/seed/${hotel.id}-garden-1/400/300.jpg`,
          `https://picsum.photos/seed/${hotel.id}-garden-2/400/300.jpg`
        ]
      });
    }
    
    if (hotel.name.includes('精品') || hotel.name.includes('文化')) {
      // 精品或文化酒店添加主题房
      roomTypes.push({
        name: `${hotel.name}文化主题房`,
        description: '融合当地文化元素的主题客房，提供独特的住宿体验',
        capacity: 2,
        bedType: '大床',
        area: 30,
        amenities: ['空调', '电视', '免费WiFi', '吹风机', '热水壶', '文化装饰', '茶具'],
        images: [
          `https://picsum.photos/seed/${hotel.id}-theme-1/400/300.jpg`,
          `https://picsum.photos/seed/${hotel.id}-theme-2/400/300.jpg`
        ]
      });
    }

    // 创建房型
    const createdRoomTypes = [];
    for (const roomType of roomTypes) {
      const existingRoomType = await prisma.roomType.findFirst({
        where: { 
          hotelId: hotel.id,
          name: roomType.name
        }
      });

      if (!existingRoomType) {
        const createdRoomType = await prisma.roomType.create({
          data: {
            ...roomType,
            hotelId: hotel.id
          }
        });
        createdRoomTypes.push(createdRoomType);
        console.log(`房型创建成功: ${roomType.name}`);
      } else {
        createdRoomTypes.push(existingRoomType);
        console.log(`房型已存在: ${roomType.name}`);
      }
    }

    // 6. 为每个房型创建价格方案
    for (const roomType of createdRoomTypes) {
      // 基础价格（根据房型和酒店星级）
      let basePrice = 300; // 默认价格
      
      if (hotel.starRating === 5) {
        basePrice = roomType.name.includes('总统') ? 3000 : 
                   roomType.name.includes('行政') ? 1500 : 
                   roomType.name.includes('套房') ? 1200 : 
                   roomType.name.includes('海景') || roomType.name.includes('园景') ? 800 : 
                   roomType.name.includes('大床') ? 600 : 500;
      } else {
        basePrice = roomType.name.includes('家庭') ? 800 : 
                   roomType.name.includes('主题') ? 500 : 
                   roomType.name.includes('大床') ? 400 : 300;
      }
      
      // 创建基础价格方案
      const existingPricePlan = await prisma.pricePlan.findFirst({
        where: { 
          roomTypeId: roomType.id,
          isActive: true
        }
      });

      if (!existingPricePlan) {
        await prisma.pricePlan.create({
          data: {
            roomTypeId: roomType.id,
            price: basePrice * 100, // 转换为分
            currency: 'CNY',
            isActive: true
          }
        });
        console.log(`价格方案创建成功: ${roomType.name} - ¥${basePrice}`);
      }
      
      // 创建淡季价格方案（8折）
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      
      const existingDiscountPlan = await prisma.pricePlan.findFirst({
        where: { 
          roomTypeId: roomType.id,
          discount: 0.8
        }
      });
      
      if (!existingDiscountPlan) {
        await prisma.pricePlan.create({
          data: {
            roomTypeId: roomType.id,
            price: basePrice * 100 * 0.8, // 转换为分
            currency: 'CNY',
            discount: 0.8,
            startDate: new Date(today.getFullYear(), 8, 1), // 9月1日开始
            endDate: new Date(today.getFullYear(), 10, 30), // 11月30日结束
            isActive: true
          }
        });
        console.log(`淡季价格方案创建成功: ${roomType.name} - ¥${basePrice * 0.8}`);
      }
    }

    // 7. 为每个酒店添加附近景点
    const attractions = [
      {
        name: `${hotel.city}国际购物中心`,
        type: AttractionType.SHOPPING,
        distance: 500,
        description: '大型购物中心，汇集国际品牌和本土特色商品',
        images: [`https://picsum.photos/seed/${hotel.id}-shopping-1/400/300.jpg`]
      },
      {
        name: `${hotel.city}中央公园`,
        type: AttractionType.SCENIC_SPOT,
        distance: 300,
        description: '城市中心的绿色休闲空间，适合散步和晨练',
        images: [`https://picsum.photos/seed/${hotel.id}-park-1/400/300.jpg`]
      },
      {
        name: `${hotel.city}地铁站`,
        type: AttractionType.TRANSPORTATION,
        distance: 200,
        description: '便捷的地铁交通，连接城市各大区域',
        images: [`https://picsum.photos/seed/${hotel.id}-metro-1/400/300.jpg`]
      },
      {
        name: `${hotel.city}特色美食街`,
        type: AttractionType.RESTAURANT,
        distance: 150,
        description: '汇集当地特色美食和小吃，体验地道风味',
        images: [`https://picsum.photos/seed/${hotel.id}-food-1/400/300.jpg`]
      },
      {
        name: `${hotel.city}国际会展中心`,
        type: AttractionType.ENTERTAINMENT,
        distance: 1000,
        description: '大型会展和活动场所，举办各类展览和会议',
        images: [`https://picsum.photos/seed/${hotel.id}-expo-1/400/300.jpg`]
      }
    ];

    // 根据酒店位置添加特定景点
    if (hotel.city === '北京') {
      attractions.push(
        {
          name: '故宫博物院',
          type: AttractionType.SCENIC_SPOT,
          distance: 2000,
          description: '中国明清两代的皇家宫殿，世界文化遗产',
          images: [`https://picsum.photos/seed/${hotel.id}-forbidden-city-1/400/300.jpg`]
        },
        {
          name: '首都国际机场',
          type: AttractionType.TRANSPORTATION,
          distance: 30000,
          description: '北京主要国际机场，连接世界各地',
          images: [`https://picsum.photos/seed/${hotel.id}-airport-1/400/300.jpg`]
        }
      );
    } else if (hotel.city === '上海') {
      attractions.push(
        {
          name: '外滩',
          type: AttractionType.SCENIC_SPOT,
          distance: 500,
          description: '上海标志性景观，欣赏黄浦江两岸风光',
          images: [`https://picsum.photos/seed/${hotel.id}-bund-1/400/300.jpg`]
        },
        {
          name: '浦东国际机场',
          type: AttractionType.TRANSPORTATION,
          distance: 40000,
          description: '上海主要国际机场，国际航班枢纽',
          images: [`https://picsum.photos/seed/${hotel.id}-pudong-airport-1/400/300.jpg`]
        }
      );
    } else if (hotel.city === '三亚') {
      attractions.push(
        {
          name: '亚龙湾热带天堂森林公园',
          type: AttractionType.SCENIC_SPOT,
          distance: 5000,
          description: '热带雨林公园，欣赏自然风光和野生动物',
          images: [`https://picsum.photos/seed/${hotel.id}-yalong-park-1/400/300.jpg`]
        },
        {
          name: '三亚凤凰国际机场',
          type: AttractionType.TRANSPORTATION,
          distance: 15000,
          description: '三亚国际机场，连接国内外主要城市',
          images: [`https://picsum.photos/seed/${hotel.id}-sanya-airport-1/400/300.jpg`]
        }
      );
    } else if (hotel.city === '成都') {
      attractions.push(
        {
          name: '大熊猫繁育研究基地',
          type: AttractionType.SCENIC_SPOT,
          distance: 10000,
          description: '观赏可爱的大熊猫，了解保护工作',
          images: [`https://picsum.photos/seed/${hotel.id}-panda-1/400/300.jpg`]
        },
        {
          name: '成都双流国际机场',
          type: AttractionType.TRANSPORTATION,
          distance: 20000,
          description: '成都主要国际机场，连接国内外城市',
          images: [`https://picsum.photos/seed/${hotel.id}-chengdu-airport-1/400/300.jpg`]
        }
      );
    } else if (hotel.city === '西安') {
      attractions.push(
        {
          name: '兵马俑',
          type: AttractionType.SCENIC_SPOT,
          distance: 30000,
          description: '世界第八大奇迹，秦始皇陵的陪葬坑',
          images: [`https://picsum.photos/seed/${hotel.id}-terracotta-1/400/300.jpg`]
        },
        {
          name: '西安咸阳国际机场',
          type: AttractionType.TRANSPORTATION,
          distance: 35000,
          description: '西安主要国际机场，连接国内外城市',
          images: [`https://picsum.photos/seed/${hotel.id}-xian-airport-1/400/300.jpg`]
        }
      );
    } else if (hotel.city === '杭州') {
      attractions.push(
        {
          name: '西湖',
          type: AttractionType.SCENIC_SPOT,
          distance: 1000,
          description: '中国著名湖泊，世界文化遗产，四季景色各异',
          images: [`https://picsum.photos/seed/${hotel.id}-westlake-1/400/300.jpg`]
        },
        {
          name: '杭州萧山国际机场',
          type: AttractionType.TRANSPORTATION,
          distance: 25000,
          description: '杭州主要国际机场，连接国内外城市',
          images: [`https://picsum.photos/seed/${hotel.id}-hangzhou-airport-1/400/300.jpg`]
        }
      );
    } else if (hotel.city === '南京') {
      attractions.push(
        {
          name: '中山陵',
          type: AttractionType.SCENIC_SPOT,
          distance: 5000,
          description: '孙中山先生陵墓，中国近代史重要纪念地',
          images: [`https://picsum.photos/seed/${hotel.id}-sun-yat-sen-1/400/300.jpg`]
        },
        {
          name: '南京禄口国际机场',
          type: AttractionType.TRANSPORTATION,
          distance: 30000,
          description: '南京主要国际机场，连接国内外城市',
          images: [`https://picsum.photos/seed/${hotel.id}-nanjing-airport-1/400/300.jpg`]
        }
      );
    }

    // 创建景点
    for (const attraction of attractions) {
      const existingAttraction = await prisma.nearbyAttraction.findFirst({
        where: {
          hotelId: hotel.id,
          name: attraction.name
        }
      });

      if (!existingAttraction) {
        await prisma.nearbyAttraction.create({
          data: {
            ...attraction,
            hotelId: hotel.id
          }
        });
        console.log(`景点创建成功: ${attraction.name}`);
      }
    }
  }

  // 8. 创建轮播图数据
  console.log('创建轮播图数据...');
  const banners = [
    {
      title: '三亚海岛度假特惠',
      imageUrl: 'https://picsum.photos/seed/banner-sanya/1200/400.jpg',
      targetUrl: '/hotels?city=三亚',
      position: 1,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30))
    },
    {
      title: '杭州西湖文化之旅',
      imageUrl: 'https://picsum.photos/seed/banner-hangzhou/1200/400.jpg',
      targetUrl: '/hotels?city=杭州',
      position: 2,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30))
    },
    {
      title: '商务出行优选酒店',
      imageUrl: 'https://picsum.photos/seed/banner-business/1200/400.jpg',
      targetUrl: '/hotels?tags=商务',
      position: 3,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30))
    },
    {
      title: '会员专享优惠',
      imageUrl: 'https://picsum.photos/seed/banner-member/1200/400.jpg',
      targetUrl: '/membership',
      position: 4,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30))
    }
  ];

  for (const banner of banners) {
    const existingBanner = await prisma.banner.findFirst({
      where: { title: banner.title }
    });

    if (!existingBanner) {
      await prisma.banner.create({
        data: banner
      });
      console.log(`轮播图创建成功: ${banner.title}`);
    }
  }

  // 9. 创建示例预订数据
  console.log('创建示例预订数据...');
  const users = await prisma.user.findMany({
    where: { role: UserRole.CUSTOMER }
  });

  const roomTypes = await prisma.roomType.findMany({
    take: 10 // 只取前10个房型创建示例预订
  });

  const bookingStatuses = [BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.CANCELLED];
  const paymentStatuses = [PaymentStatus.PAID, PaymentStatus.REFUNDED];
  const paymentMethods = [PaymentMethod.ALIPAY, PaymentMethod.WECHAT_PAY, PaymentMethod.CREDIT_CARD];

  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomRoomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
    const randomHotel = await prisma.hotel.findUnique({
      where: { id: randomRoomType.hotelId }
    });
    
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 30));
    
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 5) + 1);
    
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const pricePlan = await prisma.pricePlan.findFirst({
      where: { 
        roomTypeId: randomRoomType.id,
        isActive: true 
      }
    });
    
    const totalPrice = pricePlan ? pricePlan.price * nights : 50000 * nights; // 价格单位是分
    
    const existingBooking = await prisma.booking.findFirst({
        where: {
          userId: randomUser.id,
          roomTypeId: randomRoomType.id,
          checkInDate: checkInDate
        }
      });

    if (!existingBooking) {
      await prisma.booking.create({
        data: {
          userId: randomUser.id,
          hotelId: randomHotel.id,
          roomTypeId: randomRoomType.id,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          guests: Math.floor(Math.random() * 3) + 1,
          totalPrice: totalPrice,
          currency: 'CNY',
          specialRequests: Math.random() > 0.5 ? '需要无烟房' : null,
          status: bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)],
          paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          paymentId: `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`,
          cancellationReason: Math.random() > 0.7 ? '行程变更' : null
        }
      });
      console.log(`预订创建成功: ${randomUser.fullName} - ${randomHotel.name}`);
    }
  }

  console.log('数据库填充完成！');
}

seedCompleteData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });