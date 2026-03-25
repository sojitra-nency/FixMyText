import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export const shareApi = createApi({
  reducerPath: 'shareApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createShare: builder.mutation({
      query: (body) => ({ url: '/api/v1/share', method: 'POST', body }),
    }),
    getShare: builder.query({
      query: (id) => `/api/v1/share/${id}`,
    }),
  }),
})

export const { useCreateShareMutation, useGetShareQuery } = shareApi
