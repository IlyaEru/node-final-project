import { api } from './apiSlice';

interface CreateEmployeeBody {
  firstName: string;
  lastName: string;
  startingWorkYear: number;
}

export interface UpdateEmployeeBody {
  id: string;
  firstName: string;
  lastName: string;
  startingWorkYear: number;
  department?: string;
}

interface DeleteEmployeeBody {
  id: string;
}

export const employeeApiSlice = api.injectEndpoints({
  endpoints: (build) => ({
    getEmployees: build.query<any, void>({
      query: () => '/employees',
      providesTags: ['Employee'],
    }),
    getEmployee: build.query<any, string>({
      query: (id: string) => `/employees/${id}`,
      providesTags: ['Employee'],
    }),
    createEmployee: build.mutation({
      query: (body: CreateEmployeeBody) => ({
        url: '/employees',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Employee'],
    }),

    updateEmployee: build.mutation({
      query: (body: UpdateEmployeeBody) => ({
        url: `/employees/${body.id}`,
        method: 'PUT',
        body: { ...body, id: undefined },
      }),
      invalidatesTags: ['Employee', 'Department'],
    }),
    deleteEmployee: build.mutation({
      query: (body: DeleteEmployeeBody) => ({
        url: `/employees/${body.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee', 'Department', 'Shift'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApiSlice;
