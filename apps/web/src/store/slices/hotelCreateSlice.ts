import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import request from '@/utils/request';
import { HotelStatus, PricePlan, RoomType } from '../../../../server/src/types/hotel';

interface ApiErrorResponse {
  message: string;
}

interface CreateHotelRequest {
  name: string;
  englishName?: string;
  address: string;
  starRating: number;
  openingDate?: string;
  description?: string;
  city: string;
  country?: string;
  // latitude?: number;
  // longitude?: number;
  contactPhone: string;
  contactEmail: string;
  amenities?: string[];
  images?: string[];
  nearbyTransport?: string;
  nearbyShopping?: string;
  discountInfo?: string;
  status?: HotelStatus;
  // roomTypes?: RoomType[];
  roomTypes?: {
    id?: string;
    name: string;
    pricePlans: {
      price: number;
      id?: string;
      isActive: boolean;
    }[];
  }[];
}

interface CreatedHotel extends CreateHotelRequest {
  id: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  roomTypes: RoomType[];
}

interface HotelCreateState {
  loading: boolean;
  error: string | null;
  success: boolean;
  createdHotel: CreatedHotel | null;
}

const initialState: HotelCreateState = {
  loading: false,
  error: null,
  success: false,
  createdHotel: null,
};

export const createHotel = createAsyncThunk<
  CreatedHotel,
  CreateHotelRequest,
  { rejectValue: string }
>('hotels/createHotel', async (hotelData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return rejectWithValue('未找到访问令牌，请重新登录');
    }
    const response = await request<CreatedHotel>({
      url: '/api/hotels',
      method: 'POST',
      data: hotelData,
    });
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorMsg = axiosError.response?.data?.message || axiosError.message || '创建酒店失败';
    return rejectWithValue(errorMsg);
  }
});

const hotelCreateSlice = createSlice({
  name: 'hotelCreate',
  initialState,
  reducers: {
    resetCreateHotelState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.createdHotel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.createdHotel = null;
      })
      .addCase(createHotel.fulfilled, (state, action: PayloadAction<CreatedHotel>) => {
        state.loading = false;
        state.success = true;
        state.createdHotel = action.payload;
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '未知错误';
        state.success = false;
        state.createdHotel = null;
      });
  },
});

export const { resetCreateHotelState } = hotelCreateSlice.actions;

export default hotelCreateSlice.reducer;
