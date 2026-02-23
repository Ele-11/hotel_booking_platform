export type RootStackParamList = {

  Home: undefined; // 首页不需要参数

  HotelList: {
    province: string;
    city: string;
    startDate: string;
    endDate: string;
    price?: string;
    keyword?: string;
    roomType?: string;
  }; // 列表页接收查询条件
  
  HotelDetail: {
    hotelId: string;
    hotelName?: string;
  }; // 详情页接收酒店ID
  
};