// api/sort.ts
import http from '../utils/http';
import type { ResType } from './shared';

// 定义排序选项项的类型
export type SortOption = {
    label: string;
    value: string;
};

// 响应数据类型
type SortRes = {
    options: SortOption[];
};

// 获取排序选项
export function fetchSortOptions() {
    return http.request<ResType<SortRes>>({
        url: '/sort/options', // 假设的接口地址
        method: 'GET',
    });
}