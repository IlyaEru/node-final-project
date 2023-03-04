import { api } from './apiSlice';

interface CreateShiftBody {
  date: Date;
  startTime: Date;
  endTime: Date;
  employees?: string[];
}

interface UpdateShiftBody {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  employees?: string[];
}

const shiftApiSlice = api.injectEndpoints({
  endpoints: (build) => ({
    getShifts: build.query<any, void>({
      query: () => '/shifts',
      providesTags: ['Shift'],
    }),
    getShift: build.query<any, string>({
      query: (id: string) => `/shifts/${id}`,
      providesTags: ['Shift'],
    }),
    createShift: build.mutation({
      query: (body: CreateShiftBody) => ({
        url: '/shifts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Shift'],
    }),
    updateShift: build.mutation({
      query: (body: UpdateShiftBody) => ({
        url: `/shifts/${body.id}`,
        method: 'PUT',
        body: { ...body, id: undefined },
      }),
      invalidatesTags: ['Shift'],
    }),
  }),
});

export const {
  useGetShiftsQuery,
  useGetShiftQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
} = shiftApiSlice;
