export type RootStackParamList = {

  Home: undefined; // 首页不需要参数

  HotelList: {
    province?: string;
    city: string;
    startDate: string;
    endDate: string;
    price?: string;
    keyword?: string;
    roomType?: string;
    name?: string;
    brand?: string;
    starRating?: number;
  }; // 列表页接收查询条件
  
  HotelDetail: {
    hotelId: string;
    hotelName?: string;
    starRating?: number;
  }; // 详情页接收酒店ID
  
};