import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export const getOrders = createAsyncThunk<TOrder[]>(
  'orders/getAll',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(
        getOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      );
  }
});

export const ordersSliceReducer = ordersSlice.reducer;

// Селекторы с типизацией RootState
export const ordersSliceSelectors = {
  selectOrders: (state: RootState) => state.orders.orders,
  selectIsLoading: (state: RootState) => state.orders.isLoading,
  selectError: (state: RootState) => state.orders.error
};
