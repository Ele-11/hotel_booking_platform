// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// export interface SearchFilters {
//   starRating: number[];
//   priceRange: [number, number];
//   tags: string[];
// }

// export interface SearchParams {
//   location: string;
//   keyword: string;
//   checkInDate: string;
//   checkOutDate: string;
//   filters: SearchFilters;
// }

// interface HotelSearchState {
//   searchParams: SearchParams;
//   searchHistory: SearchParams[];
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: HotelSearchState = {
//   searchParams: {
//     location: '北京',
//     keyword: '',
//     checkInDate: '',
//     checkOutDate: '',
//     filters: {
//       starRating: [],
//       priceRange: [0, 5000],
//       tags: [],
//     },
//   },
//   searchHistory: [],
//   isLoading: false,
//   error: null,
// };

// const hotelSearchSlice = createSlice({
//   name: 'hotelSearch',
//   initialState,
//   reducers: {
//     setLocation: (state, action: PayloadAction<string>) => {
//       state.searchParams.location = action.payload;
//     },
//     setKeyword: (state, action: PayloadAction<string>) => {
//       state.searchParams.keyword = action.payload;
//     },
//     setCheckInDate: (state, action: PayloadAction<string>) => {
//       state.searchParams.checkInDate = action.payload;
//     },
//     setCheckOutDate: (state, action: PayloadAction<string>) => {
//       state.searchParams.checkOutDate = action.payload;
//     },
//     toggleStarRating: (state, action: PayloadAction<number>) => {
//       const star = action.payload;
//       const index = state.searchParams.filters.starRating.indexOf(star);
//       if (index >= 0) {
//         state.searchParams.filters.starRating.splice(index, 1);
//       } else {
//         state.searchParams.filters.starRating.push(star);
//       }
//     },
//     setPriceRange: (state, action: PayloadAction<[number, number]>) => {
//       state.searchParams.filters.priceRange = action.payload;
//     },
//     toggleTag: (state, action: PayloadAction<string>) => {
//       const tag = action.payload;
//       const index = state.searchParams.filters.tags.indexOf(tag);
//       if (index >= 0) {
//         state.searchParams.filters.tags.splice(index, 1);
//       } else {
//         state.searchParams.filters.tags.push(tag);
//       }
//     },
//     setSearchParams: (state, action: PayloadAction<SearchParams>) => {
//       state.searchParams = action.payload;
//       // 添加到搜索历史（最多保留10条）
//       state.searchHistory.unshift(action.payload);
//       if (state.searchHistory.length > 10) {
//         state.searchHistory.pop();
//       }
//     },
//     clearSearchParams: (state) => {
//       state.searchParams = initialState.searchParams;
//     },
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.isLoading = action.payload;
//     },
//     setError: (state, action: PayloadAction<string | null>) => {
//       state.error = action.payload;
//     },
//   },
// });

// export const {
//   setLocation,
//   setKeyword,
//   setCheckInDate,
//   setCheckOutDate,
//   toggleStarRating,
//   setPriceRange,
//   toggleTag,
//   setSearchParams,
//   clearSearchParams,
//   setLoading,
//   setError,
// } = hotelSearchSlice.actions;

// export default hotelSearchSlice.reducer;