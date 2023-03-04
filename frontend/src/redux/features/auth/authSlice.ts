import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { RootState } from '../../store';

export interface AuthState {
  fullName: string | null;
  token: string | null;
  actions: {
    actionsLeft: number;
    date: string;
  };
}

const initialState: AuthState = {
  fullName: null,
  token: null,
  actions: {
    actionsLeft: 0,
    date: '',
  },
};

interface setActionsPayload {
  actionsLeft: number;
  date: string;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.fullName = action.payload.fullName;
      state.token = action.payload.token;
      state.actions.actionsLeft = action.payload.actions.actionsLeft;
      state.actions.date = action.payload.actions.date;
    },
    clearAuth: (state) => {
      state.fullName = null;
      state.token = null;
      state.actions.actionsLeft = 0;
      state.actions.date = '';
      localStorage.removeItem('refreshToken');
    },
    setActions(state, action: PayloadAction<number>) {
      state.actions.actionsLeft = action.payload;
      state.actions.date = dayjs().format('YYYY-MM-DD');
    },
  },
});

export const { setAuth, clearAuth, setActions } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.fullName;
export const selectActions = (state: RootState) => state.auth.actions;
export const selectToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
