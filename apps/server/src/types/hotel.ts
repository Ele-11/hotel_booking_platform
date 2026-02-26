export type HotelStatus = 'PENDING' | 'PUBLISHED' | 'DRAFT' | 'DISABLED';

export interface PricePlan {
  id?: string;
  price: number;
  isActive: boolean;
}

export interface RoomType {
  id?: string;
  name: string;
  pricePlans: PricePlan[];
}

export interface HotelMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
