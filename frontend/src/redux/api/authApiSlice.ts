import { api } from './apiSlice';

interface LoginBody {
  email: string;
  username: string;
}

interface LogoutBody {
  refreshToken: string;
}

export const authApiSlice = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (body: LoginBody) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    logout: build.mutation({
      query: (body: LogoutBody) => ({
        url: '/auth/logout',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApiSlice;
