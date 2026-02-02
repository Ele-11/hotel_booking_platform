//  创建酒店相关类型

import { IBaseEntity } from "../index";

// 酒店星级
export type HotelStarRating = 1 | 2 | 3 | 4 | 5;

// 酒店状态
export type HotelStatus = "draft" | "published" | "archived" | "under_review";

// 酒店房型
export interface IRoomType {
  id: string;
  name: string; // 如：豪华套房、标准间
  description?: string;
  capacity: number; // 可住人数
  bedType: string; // 床型：大床/双床等
  area: number; // 面积（平方米）
  amenities: string[]; // 设施
}

// 酒店价格方案
export interface IPricePlan {
  id: string;
  roomTypeId: string;
  price: number; // 基础价格
  currency: string; // 货币，默认CNY
  discount?: number; // 折扣率，如0.8表示8折
  startDate?: Date; // 优惠开始时间
  endDate?: Date; // 优惠结束时间
  isActive: boolean;
}

// 酒店基本信息
export interface IHotel extends IBaseEntity {
  name: string;
  englishName?: string;
  description: string;
  starRating: HotelStarRating;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  contactPhone: string;
  contactEmail: string;
  checkInTime: string; // 格式：14:00
  checkOutTime: string; // 格式：12:00
  amenities: string[]; // 酒店设施
  images: string[]; // 图片URL数组
  status: HotelStatus;
  ownerId: string; // 商户ID
}

// 酒店详情（包含关联信息）
export interface IHotelDetail extends IHotel {
  roomTypes: IRoomType[];
  pricePlans: IPricePlan[];
  nearbyAttractions?: INearbyAttraction[];
}

// 附近景点
export interface INearbyAttraction {
  id: string;
  name: string;
  type: "attraction" | "shopping" | "transportation";
  distance: number; // 距离（米）
  description?: string;
}

// 搜索参数
export interface IHotelSearchParams {
  city?: string;
  checkInDate?: string; // YYYY-MM-DD
  checkOutDate?: string; // YYYY-MM-DD
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  starRating?: HotelStarRating[];
  amenities?: string[];
  page?: number;
  limit?: number;
  sortBy?: "price" | "rating" | "distance";
  sortOrder?: "asc" | "desc";
}