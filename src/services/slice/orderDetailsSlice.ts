import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export const orderBurger = createAsyncThunk<
  { order: TOrder; name: string },
  string[]
>('order/create', async (items) => {
  const data = await orderBurgerApi(items);
  return data;
});

export const getOrderByNumber = createAsyncThunk<{ orders: TOrder[] }, number>(
  'order/get',
  async (orderID) => {
    const data = await getOrderByNumberApi(orderID);
    return data;
  }
);

type TOrderState = {
  neworder: TOrder | null;
  newOrderIsLoading: boolean;
  newOrderError: string | null;
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  neworder: null,
  newOrderIsLoading: false,
  newOrderError: null,
  order: null,
  isLoading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.neworder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.newOrderIsLoading = true;
        state.newOrderError = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.newOrderIsLoading = false;
        state.newOrderError = action.error.message ?? 'Failed to create order';
      })
      .addCase(
        orderBurger.fulfilled,
        (state, action: PayloadAction<{ order: TOrder }>) => {
          state.newOrderIsLoading = false;
          state.neworder = action.payload.order;
        }
      )
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to load order';
      })
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<{ orders: TOrder[] }>) => {
          state.isLoading = false;
          state.order = action.payload.orders[0] ?? null;
        }
      );
  }
});

export const ordersInfoDataSelector =
  (number: string) =>
  (state: RootState): TOrder | null => {
    // Поиск заказа по номеру в разных частях стора
    if (state.feeds.orders.length) {
      const order = state.feeds.orders.find((item) => item.number === +number);
      if (order) return order;
    }
    if (state.orders.orders.length) {
      const order = state.orders.orders.find((item) => item.number === +number);
      if (order) return order;
    }
    if (state.order.order?.number === +number) {
      return state.order.order;
    }
    return null;
  };

export const orderSliceReducer = orderSlice.reducer;

export const orderSliceActions = orderSlice.actions;

export const orderSliceSelectors = {
  selectNewOrder: (state: RootState) => state.order.neworder,
  selectNewOrderIsLoading: (state: RootState) => state.order.newOrderIsLoading,
  selectOrder: (state: RootState) => state.order.order,
  selectIsLoading: (state: RootState) => state.order.isLoading,
  selectNewOrderError: (state: RootState) => state.order.newOrderError,
  selectError: (state: RootState) => state.order.error
};
