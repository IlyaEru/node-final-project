import { api } from './apiSlice';

const actionsApiSlice = api.injectEndpoints({
  endpoints: (build) => ({
    getAllUserActions: build.query<any, void>({
      query: () => 'actions',
      providesTags: ['Action'],
    }),

    getUserActions: build.query({
      query: (id: string) => `actions/${id}`,
      providesTags: ['Action'],
    }),
  }),
});

export const { useGetUserActionsQuery, useGetAllUserActionsQuery } =
  actionsApiSlice;
