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
      { label: '人民广场', value: 'loc_1' },
      { label: '静安寺', value: 'loc_2' },
      { label: '陆家嘴', value: 'loc_3' },
      { label: '迪士尼度假区', value: 'loc_4' },
      { label: '虹桥机场', value: 'loc_5' },
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
      { label: '免费取消', value: 'free_cancel' },
      { label: '即时确认', value: 'instant_confirm' },
      { label: '含早餐', value: 'breakfast' },
      { label: '免费停车', value: 'parking' },
      { label: '健身房', value: 'gym' },
      { label: '游泳池', value: 'pool' },
    ],
  },
};

// 酒店列表（分页）
export const mockHotelList = (params?: any) => {
  const { page = 1, pageSize = 10, sort, location, priceRanges, features } = params || {};
  // 模拟不同条件的数据变化（可选）
  const total = 35;
  const hasMore = page * pageSize < total;
  const list = Array.from({ length: pageSize }).map((_, i) => ({
    id: `hotel_${page}_${i}`,
    name: `嘉豪酒店 ${(page - 1) * pageSize + i + 1}号店`,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
    score: (49 - (page * i) * 1)/10,
    comments: Math.floor(Math.random() * 500) + 800,
    address: `世纪大道${100 + (page * i) * 1}号 | 距您直线${(23 + (page * i) * 1)/10}km`,
    tags: ['免费停车', '极速WiFi', '欢迎水果'],
    price: 388 + (page * i) * 10,
  }));

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