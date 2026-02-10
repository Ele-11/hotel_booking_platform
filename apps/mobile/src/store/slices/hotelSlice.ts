// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// export interface Hotel {
//   id: string;
//   name: string;
//   nameEn: string;
//   address: string;
//   starRating: number;
//   roomTypes: string[];
//   price: number;
//   openingTime: string;
//   nearbyAttractions: string[];
//   transportation: string[];
//   shoppingMalls: string[];
//   discountInfo?: {
//     type: 'percentage' | 'fixed' | 'package';
//     value: number;
//     description: string;
//     validUntil: string;
//   };
//   images: string[];
//   tags: string[];
//   latitude?: number;
//   longitude?: number;
// }

// interface HotelState {
//   hotels: Hotel[];
//   currentHotel: Hotel | null;
//   filteredHotels: Hotel[];
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: HotelState = {
//   hotels: [],
//   currentHotel: null,
//   filteredHotels: [],
//   isLoading: false,
//   error: null,
// };

// // 模拟异步获取酒店列表
// // 在实际项目中，这里会调用真实的API
// export const fetchHotels = createAsyncThunk(
//   'hotels/fetchHotels',
//   async (searchParams: any) => {
//     // 模拟API调用延迟
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     // 模拟酒店数据
//     const mockHotels: Hotel[] = [
//       {
//         id: 'hotel001',
//         name: '北京王府井希尔顿酒店',
//         nameEn: 'Hilton Beijing Wangfujing',
//         address: '北京市东城区王府井大街138号',
//         starRating: 5,
//         roomTypes: ['豪华大床房', '行政套房', '家庭套房'],
//         price: 1200,
//         openingTime: '2018-05-01',
//         nearbyAttractions: ['故宫', '天安门广场', '王府井步行街'],
//         transportation: ['地铁1号线王府井站', '机场快线'],
//         shoppingMalls: ['王府井百货', 'APM购物中心'],
//         discountInfo: {
//           type: 'percentage',
//           value: 0.8,
//           description: '春节特惠8折',
//           validUntil: '2026-02-28'
//         },
//         images: [
//           'https://via.placeholder.com/400x300?text=希尔顿酒店',
//           'https://via.placeholder.com/400x300?text=酒店大堂',
//           'https://via.placeholder.com/400x300?text=豪华客房'
//         ],
//         tags: ['豪华', '商务', '市中心']
//       },
//       {
//         id: 'hotel002',
//         name: '北京香格里拉饭店',
//         nameEn: 'Shangri-La Hotel Beijing',
//         address: '北京市海淀区紫竹院路29号',
//         starRating: 5,
//         roomTypes: ['豪华双床房', '行政大床房', '总统套房'],
//         price: 1500,
//         openingTime: '2015-08-15',
//         nearbyAttractions: ['颐和园', '圆明园', '北京大学'],
//         transportation: ['地铁4号线人民大学站', '机场巴士'],
//         shoppingMalls: ['当代商城', '双安商场'],
//         discountInfo: {
//           type: 'package',
//           value: 200,
//           description: '机票+酒店套餐减200元',
//           validUntil: '2026-03-15'
//         },
//         images: [
//           'https://via.placeholder.com/400x300?text=香格里拉酒店',
//           'https://via.placeholder.com/400x300?text=花园景观',
//           'https://via.placeholder.com/400x300?text=豪华套房'
//         ],
//         tags: ['豪华', '度假', '亲子']
//       },
//       {
//         id: 'hotel003',
//         name: '北京国贸大酒店',
//         nameEn: 'China World Summit Wing Beijing',
//         address: '北京市朝阳区建国门外大街1号',
//         starRating: 5,
//         roomTypes: ['豪华大床房', '商务套房', '景观房'],
//         price: 1800,
//         openingTime: '2019-03-20',
//         nearbyAttractions: ['国贸商圈', '央视大楼', '世贸天阶'],
//         transportation: ['地铁1号线国贸站', '地铁10号线'],
//         shoppingMalls: ['国贸商城', 'SKP购物中心'],
//         images: [
//           'https://via.placeholder.com/400x300?text=国贸大酒店',
//           'https://via.placeholder.com/400x300?text=城市景观',
//           'https://via.placeholder.com/400x300?text=商务客房'
//         ],
//         tags: ['商务', '豪华', '市中心']
//       }
//     ];
    
//     return mockHotels;
//   }
// );

// // 模拟异步获取单个酒店详情
// export const fetchHotelById = createAsyncThunk(
//   'hotels/fetchHotelById',
//   async (hotelId: string) => {
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     // 这里应该调用真实的API，暂时返回模拟数据
//     const mockHotel = {
//       id: hotelId,
//       name: '北京王府井希尔顿酒店',
//       nameEn: 'Hilton Beijing Wangfujing',
//       address: '北京市东城区王府井大街138号',
//       starRating: 5,
//       roomTypes: ['豪华大床房', '行政套房', '家庭套房'],
//       price: 1200,
//       openingTime: '2018-05-01',
//       nearbyAttractions: ['故宫', '天安门广场', '王府井步行街'],
//       transportation: ['地铁1号线王府井站', '机场快线'],
//       shoppingMalls: ['王府井百货', 'APM购物中心'],
//       discountInfo: {
//         type: 'percentage',
//         value: 0.8,
//         description: '春节特惠8折',
//         validUntil: '2026-02-28'
//       },
//       images: [
//         'https://via.placeholder.com/400x300?text=希尔顿酒店',
//         'https://via.placeholder.com/400x300?text=酒店大堂',
//         'https://via.placeholder.com/400x300?text=豪华客房'
//       ],
//       tags: ['豪华', '商务', '市中心']
//     };
    
//     return mockHotel;
//   }
// );

// const hotelSlice = createSlice({
//   name: 'hotels',
//   initialState,
//   reducers: {
//     setCurrentHotel: (state, action: PayloadAction<Hotel | null>) => {
//       state.currentHotel = action.payload;
//     },
//     filterHotels: (state, action: PayloadAction<{
//       starRating?: number[];
//       priceRange?: [number, number];
//       tags?: string[];
//     }>) => {
//       const { starRating, priceRange, tags } = action.payload;
      
//       state.filteredHotels = state.hotels.filter(hotel => {
//         // 星级筛选
//         if (starRating && starRating.length > 0 && !starRating.includes(hotel.starRating)) {
//           return false;
//         }
        
//         // 价格筛选
//         if (priceRange && (hotel.price < priceRange[0] || hotel.price > priceRange[1])) {
//           return false;
//         }
        
//         // 标签筛选
//         if (tags && tags.length > 0) {
//           const hasMatchingTag = tags.some(tag => hotel.tags.includes(tag));
//           if (!hasMatchingTag) return false;
//         }
        
//         return true;
//       });
//     },
//     clearFilter: (state) => {
//       state.filteredHotels = state.hotels;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchHotels.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchHotels.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.hotels = action.payload;
//         state.filteredHotels = action.payload;
//       })
//       .addCase(fetchHotels.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.error.message || '获取酒店列表失败';
//       })
//       .addCase(fetchHotelById.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchHotelById.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.currentHotel = action.payload;
//       })
//       .addCase(fetchHotelById.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.error.message || '获取酒店详情失败';
//       });
//   },
// });

// export const { setCurrentHotel, filterHotels, clearFilter } = hotelSlice.actions;

// export default hotelSlice.reducer;