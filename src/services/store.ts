import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase
} from 'react-redux';

import { ingredientsSliceReducer } from './slice/ingredientsSlice';
import { feedsSliceReducer } from './slice/feedsSlice';
import { burgerConstructorSliceReducer } from './slice/burgerBuilderSlice';
import { ordersSliceReducer } from './slice/ordersSlice';
import { orderSliceReducer } from './slice/orderDetailsSlice';
import { userSliceReducer } from './slice/userSlice';

// Корневой редьюсер
export const rootReducer = combineReducers({
  ingredients: ingredientsSliceReducer,
  feeds: feedsSliceReducer,
  burgerConstructor: burgerConstructorSliceReducer,
  orders: ordersSliceReducer,
  order: orderSliceReducer,
  user: userSliceReducer
});

// Конфигурация стора с Redux Toolkit
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// Типы для RootState и AppDispatch
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Кастомные хуки с типизацией для использования в компонентах
export const useDispatch = () => useDispatchBase<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;

export default store;
