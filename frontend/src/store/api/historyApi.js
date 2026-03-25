import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export const historyApi = createApi({
  reducerPath: 'historyApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['History'],
  endpoints: (builder) => ({
    // Paginated list
    getHistory: builder.query({
      query: ({ page = 1, pageSize = 25, toolId } = {}) => {
        const params = new URLSearchParams({ page, page_size: pageSize })
        if (toolId) params.set('tool_id', toolId)
        return `/api/v1/history?${params}`
      },
      providesTags: ['History'],
    }),

    // Record new operation
    recordOperation: builder.mutation({
      query: (body) => ({ url: '/api/v1/history', method: 'POST', body }),
      invalidatesTags: ['History'],
    }),

    // Delete single entry
    deleteHistoryEntry: builder.mutation({
      query: (id) => ({ url: `/api/v1/history/${id}`, method: 'DELETE' }),
      invalidatesTags: ['History'],
    }),

    // Clear all history
    clearHistory: builder.mutation({
      query: () => ({ url: '/api/v1/history', method: 'DELETE' }),
      invalidatesTags: ['History'],
    }),

  }),
})

export const {
  useGetHistoryQuery,
  useRecordOperationMutation,
  useDeleteHistoryEntryMutation,
  useClearHistoryMutation,
} = historyApi
