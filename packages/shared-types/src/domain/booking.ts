//  创建预订相关类型

import { IBaseEntity } from "../index";

// 预订状态
export type BookingStatus = "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";

// 支付状态
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

// 支付方式
export type PaymentMethod = "credit_card" | "alipay" | "wechat_pay" | "cash";

// 预订信息
export interface IBooking extends IBaseEntity {
  userId: string;
  hotelId: string;
  roomTypeId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  totalPrice: number;
  currency: string;
  specialRequests?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentId?: string;
  cancellationReason?: string;
}

// 创建预订请求
export interface ICreateBookingRequest {
  hotelId: string;
  roomTypeId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guests: number;
  specialRequests?: string;
  paymentMethod: PaymentMethod;
}

// 预订详情
export interface IBookingDetail extends IBooking {
  hotel: {
    name: string;
    address: string;
  };
  roomType: {
    name: string;
    capacity: number;
  };
  user: {
    fullName: string;
    email: string;
    phone?: string;
  };
}
