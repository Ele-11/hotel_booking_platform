// api/feature.ts
import http from '../utils/http';
import type { ResType } from './shared';

export type FeatureOption = {
    label: string;
    value: string;
};

type FeatureRes = {
    options: FeatureOption[];
};

export function fetchFeatureOptions() {
    return http.request<ResType<FeatureRes>>({
        url: '/options/feature',
        method: 'GET',
    });
}