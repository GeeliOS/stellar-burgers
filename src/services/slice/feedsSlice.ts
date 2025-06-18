import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export const getFeeds = createAsyncThunk('feeds/getAll', async () => {
  const data = await getFeedsApi();
  return data;
});

type TFeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
        state.isLoading = false;
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(
        getFeeds.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.isLoading = false;
          state.error = null;
        }
      );
  }
});

export const feedsSliceReducer = feedsSlice.reducer;

// Селекторы
export const feedsSelectors = {
  selectFeeds: (state: RootState) => state.feeds,
  selectOrders: (state: RootState) => state.feeds.orders,
  selectTotal: (state: RootState) => state.feeds.total,
  selectTotalToday: (state: RootState) => state.feeds.totalToday,
  selectIsLoading: (state: RootState) => state.feeds.isLoading,
  selectError: (state: RootState) => state.feeds.error
};
