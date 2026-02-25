// api/hotel.ts
import type { IHotel } from '@hotel-booking-platform/shared-types/src/domain/hotel';
import  http  from '../utils/http';
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
    // 还可以加入城市、日期等参数
    city?: string;
    startDate?: string;
    endDate?: string;
    nights?: number;
    keyword?: string;
};

// 响应数据类型（包含列表和分页信息）
export type HotelListRes = {
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