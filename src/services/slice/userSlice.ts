import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { RootState } from '../store'; // предполагается, что есть тип RootState

// Тип ответа с пользователем из API
type TUserResponse = {
  user: TUser;
  accessToken?: string;
  refreshToken?: string;
};

// Получить пользователя, возвращаем TUser
export const getUser = createAsyncThunk<TUserResponse>('user/get', async () => {
  const data = await getUserApi();
  return data;
});

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async ({ email, name, password }) => {
    const data = await registerUserApi({ email, name, password });
    // Сохраняем токены
    localStorage.setItem('accessToken', data.accessToken!);
    localStorage.setItem('refreshToken', data.refreshToken!);
    return data.user;
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async ({ email, password }) => {
    const data = await loginUserApi({ email, password });
    localStorage.setItem('accessToken', data.accessToken!);
    localStorage.setItem('refreshToken', data.refreshToken!);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk<void>('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (userData) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
        state.isAuthChecked = false;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          state.isAuthChecked = true;
          state.user = action.payload.user;
          if (action.payload.accessToken) {
            localStorage.setItem('accessToken', action.payload.accessToken);
          }
          if (action.payload.refreshToken) {
            localStorage.setItem('refreshToken', action.payload.refreshToken);
          }
        }
      )
      .addCase(registerUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
        state.isAuthChecked = false;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isAuthChecked = true;
          state.user = action.payload;
        }
      )
      .addCase(loginUser.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
        state.isAuthChecked = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unknown error';
        state.isAuthChecked = false;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      });
  }
});

export const userSliceReducer = userSlice.reducer;

// Селекторы с типом RootState
export const userSliceSelectors = {
  selectUser: (state: RootState) => state.user.user,
  selectIsAuthChecked: (state: RootState) => state.user.isAuthChecked,
  selectError: (state: RootState) => state.user.error
};

export const userSliceActions = userSlice.actions;
