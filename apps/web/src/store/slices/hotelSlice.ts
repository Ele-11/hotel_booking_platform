import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
}

interface PricePlan {
  id: string;
  price: number;
  isActive: boolean;
}

interface RoomType {
  id: string;
  name: string;
  pricePlans: PricePlan[];
}

interface Hotel {
  id: string;
  hotelNo?: number | null;
  name: string;
  englishName: string;
  address: string;
  starRating: number;
  city: string;
  country: string;
  status: 'PENDING' | 'PUBLISHED' | 'DRAFT' | 'DISABLED';
  createdAt?: string;
  roomTypes: RoomType[];
}

interface HotelMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface HotelListResponse {
  data: Hotel[];
  meta: HotelMeta;
}

interface HotelListParams {
  page?: number;
  limit?: number;
  city?: string;
  starRating?: number;
  status?: 'PUBLISHED' | 'DRAFT' | 'DISABLED';
}

interface HotelState {
  list: Hotel[];
  meta: HotelMeta;
  loading: boolean;
  error: string | null;
}

const initialMeta: HotelMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const initialState: HotelState = {
  list: [],
  meta: initialMeta,
  loading: false,
  error: null,
};

export const fetchHotelList = createAsyncThunk<
  HotelListResponse,
  HotelListParams | void,
  { rejectValue: string }
>('hotels/fetchHotelList', async (params = {}, { rejectWithValue }) => {
  try {
    const queryParams = {
      page: 1,
      limit: 10,
      ...params,
    };
    const token = localStorage.getItem('access_token');
    const response = await axios.get<HotelListResponse>(
      'http://localhost:3001/api/hotels/my-hotels',
      {
        params: queryParams,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        timeout: 5000,
      }
    );
    const adapterResponse: HotelListResponse = {
      data: response.data.data,
      meta: {
        page: queryParams.page || 1,
        limit: queryParams.limit || 10,
        total: response.data.meta?.total || response.data.data.length || 0,
        totalPages: response.data.meta?.totalPages || 1,
      },
    };
    console.log('Adapted Response:', adapterResponse);
    return adapterResponse;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorMsg = axiosError.response?.data?.message || axiosError.message || '获取酒店列表失败';
    console.error('Fetch hotel list failed:', errorMsg);
    return rejectWithValue(errorMsg);
  }
});

// 在 hotelSlice.ts 中
export const deleteHotel = createAsyncThunk<string, string, { rejectValue: string }>(
  'hotels/deleteHotel',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:3001/api/hotels/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return id; // 返回被删除的 ID 以便更新前端状态
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMsg = axiosError.response?.data?.message || '删除酒店失败';
      return rejectWithValue(errorMsg);
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    resetHotelList: (state) => {
      state.list = [];
      state.meta = initialMeta;
      state.error = null;
    },
    updateHotelPagination: (state, action: PayloadAction<Partial<HotelMeta>>) => {
      state.meta = { ...state.meta, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotelList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelList.fulfilled, (state, action: PayloadAction<HotelListResponse>) => {
        // console.log('Fetched hotel list:', action.payload);
        state.loading = false;
        // state.list = action.payload.data || [];
        state.list = action.payload.data.map((hotel) => ({
          ...hotel,
          roomTypes: hotel.roomTypes || [],
          minPrice:
            hotel.roomTypes.length > 0
              ? Math.min(...hotel.roomTypes.flatMap((rt) => rt.pricePlans.map((pp) => pp.price)))
              : null,
          maxPrice:
            hotel.roomTypes.length > 0
              ? Math.max(...hotel.roomTypes.flatMap((rt) => rt.pricePlans.map((pp) => pp.price)))
              : null,
        }));
        state.meta = action.payload.meta || initialMeta;
      })
      .addCase(fetchHotelList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '未知错误';
        console.error('Fetch hotel list failed:', action.payload);
      })
      .addCase(deleteHotel.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHotel.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // 从当前列表中移除已删除的酒店，实现即时刷新
        state.list = state.list.filter((hotel) => hotel.id !== action.payload);
        state.meta.total -= 1;
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '删除失败';
      });
  },
});

export const { resetHotelList, updateHotelPagination } = hotelSlice.actions;

export default hotelSlice.reducer;
