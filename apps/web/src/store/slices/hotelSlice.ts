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

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorMsg = axiosError.response?.data?.message || axiosError.message || '获取酒店列表失败';
    return rejectWithValue(errorMsg);
  }
});

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
        state.loading = false;
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchHotelList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '未知错误';
      });
  },
});

export const { resetHotelList, updateHotelPagination } = hotelSlice.actions;

export default hotelSlice.reducer;
