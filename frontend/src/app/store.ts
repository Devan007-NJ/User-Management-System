import { configureStore, createSlice } from '@reduxjs/toolkit';

interface AuthState {
  email: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  email: localStorage.getItem('access_token') ? localStorage.getItem('user_email') : null,
  role: localStorage.getItem('access_token') ? localStorage.getItem('user_role') : null,
  isAuthenticated: !!localStorage.getItem('access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;