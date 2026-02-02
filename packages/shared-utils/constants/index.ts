/**
 * 项目常量定义
 */

// API 相关常量
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
};

// 分页相关常量
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// 酒店相关常量
export const HOTEL_CONSTANTS = {
  MAX_IMAGES: 10,
  MIN_PRICE: 0,
  MAX_PRICE: 1000000, // 10000元
  STAR_RATINGS: [1, 2, 3, 4, 5] as const,
  AMENITIES: [
    "wifi",
    "parking",
    "breakfast",
    "swimming_pool",
    "gym",
    "spa",
    "restaurant",
    "bar",
    "concierge",
    "room_service",
    "laundry",
    "business_center",
    "airport_shuttle",
    "pet_friendly",
    "family_rooms",
    "non_smoking_rooms",
  ],
  ROOM_AMENITIES: [
    "tv",
    "ac",
    "heating",
    "minibar",
    "kettle",
    "hairdryer",
    "safe",
    "bathtub",
    "shower",
    "toiletries",
    "desk",
    "wardrobe",
  ],
  BED_TYPES: ["single", "double", "queen", "king", "twin"],
};

// 预订相关常量
export const BOOKING_CONSTANTS = {
  MAX_GUESTS: 10,
  MIN_ADVANCE_BOOKING_DAYS: 0,
  MAX_ADVANCE_BOOKING_DAYS: 365,
  CANCELLATION_WINDOW_HOURS: 24,
};

// 用户相关常量
export const USER_CONSTANTS = {
  ROLES: ["admin", "merchant", "customer"] as const,
  STATUSES: ["active", "inactive", "suspended"] as const,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 100,
};

// 日期时间常量
export const DATE_CONSTANTS = {
  CHECK_IN_TIME: "14:00",
  CHECK_OUT_TIME: "12:00",
  DATE_FORMAT: "YYYY-MM-DD",
  TIME_FORMAT: "HH:mm",
  DATETIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
};

// 货币相关常量
export const CURRENCY = {
  DEFAULT: "CNY",
  SYMBOLS: {
    CNY: "¥",
    USD: "$",
    EUR: "€",
    GBP: "£",
  },
};