import { api } from './apiSlice';

interface CreateDepartmentBody {
  name: string;
  manager: string;
}

export interface UpdateDepartmentBody {
  id: string;
  name: string;
  manager: string;
  employees?: string[];
}

interface DeleteDepartmentBody {
  id: string;
}

const departmentApiSlice = api.injectEndpoints({
  endpoints: (build) => ({
    getDepartments: build.query<any, void>({
      query: () => '/departments',
      providesTags: ['Department'],
    }),
    getDepartment: build.query<any, string>({
      query: (id: string) => `/departments/${id}`,
      providesTags: ['Department'],
    }),
    createDepartment: build.mutation({
      query: (body: CreateDepartmentBody) => ({
        url: '/departments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Department'],
    }),
    updateDepartment: build.mutation({
      query: (body: UpdateDepartmentBody) => ({
        url: `/departments/${body.id}`,
        method: 'PUT',
        body: { ...body, id: undefined },
      }),
      invalidatesTags: ['Department', 'Employee'],
    }),
    deleteDepartment: build.mutation({
      query: (body: DeleteDepartmentBody) => ({
        url: `/departments/${body.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department', 'Employee'],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApiSlice;
