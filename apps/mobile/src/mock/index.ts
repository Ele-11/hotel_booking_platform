// mock/index.ts
// import type { ResType } from '../api/shared';

// 排序选项
export const mockSortOptions = {
  message: 'success',
  data: {
    options: [
      { label: '欢迎度排序', value: 'popular' },
      { label: '好评优先', value: 'score_desc' },
      { label: '低价优先', value: 'price_asc' },
      { label: '高价优先', value: 'price_desc' },
      { label: '距离优先', value: 'distance_asc' },
    ],
  },
};

// 位置选项
export const mockLocationOptions = {
  message: 'success',
  data: {
    options: [
      { label: '不限', value: 'all' },
      { label: '北京', value: '北京' },
      { label: '上海', value: '上海' },
      { label: '三亚', value: '三亚' },
      { label: '成都', value: '成都' },
      { label: '西安', value: '西安' },
      { label: '杭州', value: '杭州' },
      { label: '南京', value: '南京' },
    ],
  },
};

// 价格选项
export const mockPriceOptions = {
  message: 'success',
  data: {
    options: [
      { label: '¥150以下', value: '0-150' },
      { label: '¥150-300', value: '150-300' },
      { label: '¥300-450', value: '300-450' },
      { label: '¥450-600', value: '450-600' },
      { label: '¥600-1000', value: '600-1000' },
      { label: '¥1000以上', value: '1000-99999' },
    ],
  },
};

// 设施选项
export const mockFeatureOptions = {
  message: 'success',
  data: {
    options: [
      { label: '免费WiFi', value: '免费WiFi' },
      { label: '健身房', value: '健身房' },
      { label: '游泳池', value: '游泳池' },
      { label: '停车场', value: '停车场' },
      { label: '商务中心', value: '商务中心' },
      { label: '会议室', value: '会议室' },
      { label: '水疗中心', value: '水疗中心' },
      { label: '餐厅', value: '餐厅' },
      { label: '商务', value: '商务' },
      { label: '豪华', value: '豪华' },
      { label: '市中心', value: '市中心' },
      { label: '度假', value: '度假' },
      { label: '海滨', value: '海滨' },
      { label: '文化', value: '文化' },
      { label: '历史', value: '历史' },
    ],
  },
};

// 真实酒店数据
const realHotels = [
  {
    id: 'e6ef8098-77c0-4ae9-9b33-f083b3b529f3',
    name: '北京国贸大酒店',
    englishName: 'Beijing Guomao Grand Hotel',
    description: '位于北京CBD核心区域的五星级商务酒店，毗邻国贸商城，交通便利，设施齐全，是商务出行的理想选择。',
    stars: 5,
    address: '北京市朝阳区建国门外大街1号',
    city: '北京',
    country: '中国',
    phone: '+86-10-85651234',
    email: 'beijing.guomao@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '健身房', '室内游泳池', '商务中心', '会议室', '中西餐厅', '停车场', '机场接送'],
    tags: ['商务', '豪华', '市中心', '会议室'],
    images: ['https://picsum.photos/seed/beijing-guomao-1/800/600.jpg', 'https://picsum.photos/seed/beijing-guomao-2/800/600.jpg', 'https://picsum.photos/seed/beijing-guomao-3/800/600.jpg'],
    price: 1200,
    score: 4.7,
    comments: 2156
  },
  {
    id: '5a70597a-ec95-426f-b336-f7fa0f138bb6',
    name: '上海外滩华尔道夫酒店',
    englishName: 'Waldorf Astoria Shanghai on the Bund',
    description: '坐拥外滩绝佳江景的奢华酒店，融合了古典与现代设计，提供无与伦比的住宿体验。',
    stars: 5,
    address: '上海市黄浦区中山东一路2号',
    city: '上海',
    country: '中国',
    phone: '+86-21-63229988',
    email: 'shanghai.bund@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '健身房', '室外游泳池', '水疗中心', '中西餐厅', '酒吧', '行政酒廊', '停车场'],
    tags: ['豪华', '江景', '浪漫', '商务'],
    images: ['https://picsum.photos/seed/shanghai-bund-1/800/600.jpg', 'https://picsum.photos/seed/shanghai-bund-2/800/600.jpg', 'https://picsum.photos/seed/shanghai-bund-3/800/600.jpg'],
    price: 2800,
    score: 4.8,
    comments: 1823
  },
  {
    id: 'cd04a5cd-f495-4d3f-b020-96bc2a6a88f6',
    name: '北京王府井希尔顿酒店',
    englishName: 'Hilton Beijing Wangfujing',
    description: '位于北京繁华的王府井商业区，步行可达故宫和天安门广场，是商务和休闲旅客的理想选择。',
    stars: 5,
    address: '北京市东城区王府井东街8号',
    city: '北京',
    country: '中国',
    phone: '+86-10-58128888',
    email: 'beijing.wangfujing@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '健身房', '室内游泳池', '商务中心', '中西餐厅', '停车场', '机场接送'],
    tags: ['商务', '市中心', '购物'],
    images: ['https://picsum.photos/seed/beijing-wangfujing-1/800/600.jpg', 'https://picsum.photos/seed/beijing-wangfujing-2/800/600.jpg', 'https://picsum.photos/seed/beijing-wangfujing-3/800/600.jpg'],
    price: 1500,
    score: 4.6,
    comments: 1945
  },
  {
    id: '807e4b12-b051-42ee-a36d-ac285e831e35',
    name: '三亚亚特兰蒂斯度假酒店',
    englishName: 'Atlantis Sanya Resort',
    description: '位于海棠湾的海滨度假胜地，拥有私人海滩、水世界和海豚湾，是家庭度假的理想选择。',
    stars: 5,
    address: '海南省三亚市海棠区海棠北路36号',
    city: '三亚',
    country: '中国',
    phone: '+86-898-88612345',
    email: 'sanya.atlantis@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '健身房', '室外游泳池', '私人海滩', '水世界', '海豚湾', '中西餐厅', '儿童俱乐部', '停车场'],
    tags: ['度假', '海滨', '家庭游', '豪华'],
    images: ['https://picsum.photos/seed/sanya-atlantis-1/800/600.jpg', 'https://picsum.photos/seed/sanya-atlantis-2/800/600.jpg', 'https://picsum.photos/seed/sanya-atlantis-3/800/600.jpg'],
    price: 3200,
    score: 4.9,
    comments: 2567
  },
  {
    id: '226fa19b-c06e-43fc-b83b-1059aabebe2f',
    name: '成都宽窄巷子精品酒店',
    englishName: 'Chengdu Kuanzhai Alley Boutique Hotel',
    description: '位于成都著名的历史文化街区宽窄巷子旁，融合传统川西建筑风格与现代舒适设施。',
    stars: 4,
    address: '四川省成都市青羊区宽窄巷子子街28号',
    city: '成都',
    country: '中国',
    phone: '+86-28-86245678',
    email: 'chengdu.kuanzhai@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '茶室', '川菜餐厅', '传统庭院', '文化体验区', '停车场'],
    tags: ['精品', '文化', '市中心', '传统'],
    images: ['https://picsum.photos/seed/chengdu-kuanzhai-1/800/600.jpg', 'https://picsum.photos/seed/chengdu-kuanzhai-2/800/600.jpg', 'https://picsum.photos/seed/chengdu-kuanzhai-3/800/600.jpg'],
    price: 680,
    score: 4.5,
    comments: 1234
  },
  {
    id: 'aa1fe05d-5e0c-42cf-9f04-18e2d2a2c6ed',
    name: '西安大唐不夜城酒店',
    englishName: 'Xi\'an Datang Everbright City Hotel',
    description: '坐落在大雁塔北广场，毗邻大唐不夜城，可步行至大雁塔和陕西历史博物馆。',
    stars: 4,
    address: '陕西省西安市雁塔区雁塔南路10号',
    city: '西安',
    country: '中国',
    phone: '+86-29-87654321',
    email: 'xian.datang@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '健身房', '中餐厅', '唐文化体验区', '会议室', '停车场'],
    tags: ['文化', '历史', '市中心'],
    images: ['https://picsum.photos/seed/xian-datang-1/800/600.jpg', 'https://picsum.photos/seed/xian-datang-2/800/600.jpg', 'https://picsum.photos/seed/xian-datang-3/800/600.jpg'],
    price: 750,
    score: 4.4,
    comments: 987
  },
  {
    id: 'adfe95e9-5017-42d8-8019-5536cbd37caa',
    name: '三亚海棠湾康莱德酒店',
    englishName: 'Conrad Sanya Haitang Bay',
    description: '位于海棠湾的奢华度假酒店，拥有私人海滩和无边泳池，提供极致的度假体验。',
    stars: 5,
    address: '海南省三亚市海棠区海棠湾路28号',
    city: '三亚',
    country: '中国',
    phone: '+86-898-88889999',
    email: 'sanya.conrad@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '健身房', '室外游泳池', '私人海滩', '无边泳池', '水疗中心', '中西餐厅', '酒吧', '儿童俱乐部'],
    tags: ['度假', '海滨', '豪华', '浪漫'],
    images: ['https://picsum.photos/seed/sanya-conrad-1/800/600.jpg', 'https://picsum.photos/seed/sanya-conrad-2/800/600.jpg', 'https://picsum.photos/seed/sanya-conrad-3/800/600.jpg'],
    price: 2800,
    score: 4.8,
    comments: 1654
  },
  {
    id: '76124494-5a1d-4e9e-bf58-354ce37ec673',
    name: '杭州西湖四季酒店',
    englishName: 'Four Seasons Hotel Hangzhou at West Lake',
    description: '坐拥西湖美景的奢华酒店，融合江南园林设计，提供宁静优雅的住宿体验。',
    stars: 5,
    address: '浙江省杭州市西湖区灵隐路5号',
    city: '杭州',
    country: '中国',
    phone: '+86-571-87998888',
    email: 'hangzhou.westlake@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '健身房', '室外游泳池', '水疗中心', '中西餐厅', '茶室', '湖景露台', '停车场'],
    tags: ['豪华', '湖景', '园林', '浪漫'],
    images: ['https://picsum.photos/seed/hangzhou-westlake-1/800/600.jpg', 'https://picsum.photos/seed/hangzhou-westlake-2/800/600.jpg', 'https://picsum.photos/seed/hangzhou-westlake-3/800/600.jpg'],
    price: 2200,
    score: 4.9,
    comments: 1876
  },
  {
    id: '2d69b2c1-fdc9-40a0-b193-5867b99a048f',
    name: '南京夫子庙亚朵酒店',
    englishName: 'Atour Hotel Nanjing Fuzimiao',
    description: '位于南京夫子庙历史文化街区，融合现代设计与传统文化，步行可达秦淮河和夫子庙。',
    stars: 4,
    address: '江苏省南京市秦淮区建康路258号',
    city: '南京',
    country: '中国',
    phone: '+86-25-86678888',
    email: 'nanjing.fuzimiao@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '健身房', '中餐厅', '茶室', '图书馆', '会议室', '停车场'],
    tags: ['文化', '历史', '市中心', '精品'],
    images: ['https://picsum.photos/seed/nanjing-fuzimiao-1/800/600.jpg', 'https://picsum.photos/seed/nanjing-fuzimiao-2/800/600.jpg', 'https://picsum.photos/seed/nanjing-fuzimiao-3/800/600.jpg'],
    price: 650,
    score: 4.6,
    comments: 1123
  },
  {
    id: '5b8a9f9b-cc77-4228-a52b-0c06cd6ec3ac',
    name: '杭州钱江新城万豪酒店',
    englishName: 'Hangzhou Marriott Hotel Qianjiang',
    description: '位于杭州钱江新城CBD核心区，坐拥钱塘江景，是商务和休闲旅客的理想选择。',
    stars: 5,
    address: '浙江省杭州市江干区民心路88号',
    city: '杭州',
    country: '中国',
    phone: '+86-571-89738888',
    email: 'hangzhou.qianjiang@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '健身房', '室内游泳池', '商务中心', '中西餐厅', '行政酒廊', '江景房', '停车场'],
    tags: ['商务', '江景', '市中心', '豪华'],
    images: ['https://picsum.photos/seed/hangzhou-qianjiang-1/800/600.jpg', 'https://picsum.photos/seed/hangzhou-qianjiang-2/800/600.jpg', 'https://picsum.photos/seed/hangzhou-qianjiang-3/800/600.jpg'],
    price: 1800,
    score: 4.7,
    comments: 1456
  },
  {
    id: 'ac99dc69-fef9-4721-bb85-216f9bc73b7a',
    name: '南京新街口苏宁诺富特酒店',
    englishName: 'Novotel Nanjing Xinjiekou Suning',
    description: '位于南京繁华的新街口商业区，毗邻苏宁广场，交通便利，购物方便。',
    stars: 4,
    address: '江苏省南京市鼓楼区中山路1号',
    city: '南京',
    country: '中国',
    phone: '+86-25-83218888',
    email: 'nanjing.xinjiekou@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '健身房', '室内游泳池', '中西餐厅', '会议室', '停车场'],
    tags: ['商务', '市中心', '购物'],
    images: ['https://picsum.photos/seed/nanjing-xinjiekou-1/800/600.jpg', 'https://picsum.photos/seed/nanjing-xinjiekou-2/800/600.jpg', 'https://picsum.photos/seed/nanjing-xinjiekou-3/800/600.jpg'],
    price: 720,
    score: 4.3,
    comments: 987
  },
  {
    id: '60e84cdd-6e65-4519-804c-0f044afc3382',
    name: '杭州西溪悦榕庄',
    englishName: 'Banyan Tree Hangzhou',
    description: '坐落于杭州西溪湿地旁的奢华度假酒店，融合江南水乡风情与现代奢华设施。',
    stars: 5,
    address: '浙江省杭州市西湖区紫金港路21号',
    city: '杭州',
    country: '中国',
    phone: '+86-571-89876666',
    email: 'hangzhou.xixi@hotelbooking.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    amenities: ['免费WiFi', '健身房', '室外游泳池', '水疗中心', '中西餐厅', '酒吧', '湿地景观', '停车场'],
    tags: ['度假', '湿地', '奢华', '自然'],
    images: ['https://picsum.photos/seed/hangzhou-xixi-1/800/600.jpg', 'https://picsum.photos/seed/hangzhou-xixi-2/800/600.jpg', 'https://picsum.photos/seed/hangzhou-xixi-3/800/600.jpg'],
    price: 2500,
    score: 4.8,
    comments: 1234
  }
];

// 酒店列表（分页）
export const mockHotelList = (params?: any) => {
  const { 
    page = 1, 
    pageSize = 10, 
    sort, 
    location, 
    priceRanges = [], 
    features = [],
    city,
    keyword
  } = params || {};
  
  // 使用真实酒店数据
  let allHotels = realHotels.map(hotel => ({
    id: hotel.id,
    name: hotel.name,
    image: hotel.images[0], // 使用第一张图片作为主图
    score: hotel.score,
    comments: hotel.comments,
    address: hotel.address,
    tags: hotel.tags,
    price: hotel.price,
    city: hotel.city,
    stars: hotel.stars,
    amenities: hotel.amenities,
    description: hotel.description
  }));
  
  // 应用筛选条件
  let filteredHotels = allHotels;
  
  // 城市筛选
  if (city && city !== '') {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.city === city || hotel.address.includes(city)
    );
  }
  
  // 位置筛选 - 如果选择了特定位置且不是"不限"或空字符串
  if (location && location !== 'all' && location !== '') {
    // 对于真实数据，位置筛选可能对应不同的区域或商圈
    // 这里简化处理，直接在地址中搜索位置关键词
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.address.includes(location) || 
      hotel.tags.some(tag => tag.includes(location))
    );
  }
  
  // 价格区间筛选
  if (priceRanges && priceRanges.length > 0) {
    filteredHotels = filteredHotels.filter(hotel => {
      return priceRanges.some((range: { split: (arg0: string) => { (): any; new(): any; map: { (arg0: NumberConstructor): [any, any]; new(): any; }; }; }) => {
        const [min, max] = range.split('-').map(Number);
        if (max === 99999) return hotel.price >= min; // "1000以上"的情况
        return hotel.price >= min && hotel.price <= max;
      });
    });
  }
  
  // 设施筛选
  if (features && features.length > 0) {
    const featureMap: { [key: string]: string } = {
      'free_cancel': '免费取消',
      'instant_confirm': '即时确认',
      'breakfast': '含早餐',
      'parking': '免费停车',
      'gym': '健身房',
      'pool': '游泳池',
    };
    
    filteredHotels = filteredHotels.filter(hotel => {
      // 只要酒店包含任一选中的设施即可
      return features.some((feature: string | number) => {
        const featureName = String(featureMap[feature] || feature);
        // 检查标签和设施
        return hotel.tags.includes(featureName) || 
               hotel.amenities.some(amenity => amenity.includes(featureName));
      });
    });
  }
  
  // 关键词搜索
  if (keyword) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.name.includes(keyword) || 
      hotel.address.includes(keyword)
    );
  }
  
  // 如果没有筛选结果，返回所有酒店（放宽条件）
  // 或者如果筛选条件过于严格（如空字符串），也返回所有酒店
  if (filteredHotels.length === 0 || (!city && !location && !priceRanges.length && !features.length && !keyword)) {
    console.log('No filters applied or no results, returning all hotels');
    filteredHotels = allHotels;
  }
  
  // 排序
  if (sort) {
    switch (sort) {
      case 'price_asc':
        filteredHotels.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredHotels.sort((a, b) => b.price - a.price);
        break;
      case 'score_desc':
        filteredHotels.sort((a, b) => b.score - a.score);
        break;
      case 'distance_asc':
        // 这里简化处理，随机排序
        filteredHotels.sort(() => Math.random() - 0.5);
        break;
      default:
        // 默认按欢迎度排序（随机）
        filteredHotels.sort(() => Math.random() - 0.5);
    }
  }
  
  // 分页处理
  const total = filteredHotels.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = filteredHotels.slice(startIndex, endIndex);
  const hasMore = endIndex < total;
  
  return {
    message: 'success',
    data: {
      list,
      total,
      page,
      pageSize,
      hasMore,
    },
  };
};