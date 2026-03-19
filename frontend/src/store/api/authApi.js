import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Me'],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: '/api/v1/auth/register', method: 'POST', body }),
      invalidatesTags: ['Me'],
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/api/v1/auth/login', method: 'POST', body }),
      invalidatesTags: ['Me'],
    }),
    logout: builder.mutation({
      query: () => ({ url: '/api/v1/auth/logout', method: 'POST' }),
    }),
    refresh: builder.mutation({
      query: () => ({ url: '/api/v1/auth/refresh', method: 'POST' }),
      invalidatesTags: ['Me'],
    }),
    getMe: builder.query({
      query: () => '/api/v1/auth/me',
      providesTags: ['Me'],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,

  useGetMeQuery,
} = authApi
