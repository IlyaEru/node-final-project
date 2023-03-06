import axios from 'redaxios';
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { setAuth, clearAuth, setActions } from '../features/auth/authSlice';
import { RootState } from '../store';
import dayjs from 'dayjs';

const baseUrl = 'https://node-final-project-production.up.railway.app';

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    // reauth
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const response = await axios.post(`${baseUrl}/auth/refresh`, {
        refreshToken,
      });
      if (response.status === 200) {
        const { user, tokens, userActionsLeft } = response.data;
        localStorage.setItem('refreshToken', tokens.refresh.token);
        api.dispatch(
          setAuth({
            token: tokens.access.token,
            fullName: user.fullName,
            actions: {
              actionsLeft: userActionsLeft,
              date: dayjs().format('YYYY-MM-DD'),
            },
          }),
        );
        result = await baseQuery(args, api, extraOptions);
      }
    } else {
      api.dispatch(clearAuth());
    }
  }
  const headers = result.meta?.response?.headers;
  const actionsLeft = headers?.get('x-user-actions-left');
  if (actionsLeft) {
    if (actionsLeft === '0') {
      api.dispatch(clearAuth());
    }

    api.dispatch(setActions(Number(actionsLeft)));
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Employee', 'Shift', 'Department', 'Action'],
  endpoints: (build) => ({}),
});
