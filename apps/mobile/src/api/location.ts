// api/location.ts
import  http  from '../utils/http';
import type { ResType } from './shared';

export type LocationOption = {
    label: string;
    value: string;
};

type LocationRes = {
    options: LocationOption[];
};

export function fetchLocationOptions() {
    return http.request<ResType<LocationRes>>({
        url: '/location/options',
        method: 'GET',
    });
}