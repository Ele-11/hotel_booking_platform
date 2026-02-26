// api/hotel.ts
import type { IHotel } from '@hotel-booking-platform/shared-types/src/domain/hotel';
import http from '../utils/http';
import type { ResType } from './shared';

// 请求参数
export type HotelListParams = {
    sort?: string;               // 排序方式
    location?: string;           // 位置筛选
    priceRanges?: string[];      // 价格区间数组
    stars?: string[];            // 星级数组
    features?: string[];         // 设施数组
    page?: number;               // 页码（从1开始）
    pageSize?: number;           // 每页条数
    minPrice?: number;
    maxPrice?: number;
    sortOrder?: string;            
    sortBy?: string;  // 排序字段，如 price、rating、distance
    checkInDate?: string;
    checkOutDate?: string;
    guests?: number;
    tags?: string[]; // 设施标签
    // 还可以加入城市、日期等参数
    city?: string;
    startDate?: string;
    endDate?: string;
    nights?: number;
    keyword?: string;
};

// 响应数据类型（包含列表和分页信息）
export type HotelListRes = {
    map(arg0: (item: any) => { id: any; name: any; image: any; score: any; comments: number; address: any; tags: any; price: any; }): any[];
    list: IHotel[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
};

export function fetchHotelList(params: HotelListParams) {
    return http.request<ResType<HotelListRes>>({
        url: '/hotels/list',
        method: 'GET',
        params, // axios 会将 params 对象转为查询字符串
    });
}

// 获取酒店详情
export function fetchHotelDetail(hotelId: string) {
    return http.request<ResType<IHotel>>({
        url: `/hotels/${hotelId}`,
        method: 'GET',
    });
}

// 获取酒店房型及价格信息
export type RoomTypeParams = {
    checkInDate?: string;
    checkOutDate?: string;
    guests?: number;
};

export type RoomType = {
    id: string;
    name: string;
    description?: string;
    maxGuests: number;
    basePrice: number;
    pricePlans: {
        id: string;
        price: number;
        effectiveFrom: string;
        effectiveTo: string;
    }[];
    amenities: string[];
    images: string[];
    availableFrom: string;
    availableTo: string;
};

export type RoomTypeRes = {
    roomTypes: RoomType[];
};

export function fetchHotelRoomTypes(hotelId: string, params?: RoomTypeParams) {
    return http.request<ResType<RoomTypeRes>>({
        url: `/hotels/${hotelId}/room-types`,
        method: 'GET',
        params,
    });
}