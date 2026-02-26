// api/price.ts
import http from '../utils/http';
import type { ResType } from './shared';

export type PriceOption = {
    label: string;
    value: string; // 如 "0-150", "150-300"
};

type PriceRes = {
    options: PriceOption[];
};

export function fetchPriceOptions() {
    return http.request<ResType<PriceRes>>({
        url: '/options/price',
        method: 'GET',
    });
}