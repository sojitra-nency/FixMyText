import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export const historyApi = createApi({
  reducerPath: 'historyApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['History', 'HistoryStats'],
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
      invalidatesTags: ['History', 'HistoryStats'],
    }),

    // Get single entry
    getHistoryEntry: builder.query({
      query: (id) => `/api/v1/history/${id}`,
      providesTags: (result, error, id) => [{ type: 'History', id }],
    }),

    // Delete single entry
    deleteHistoryEntry: builder.mutation({
      query: (id) => ({ url: `/api/v1/history/${id}`, method: 'DELETE' }),
      invalidatesTags: ['History', 'HistoryStats'],
    }),

    // Clear all history
    clearHistory: builder.mutation({
      query: () => ({ url: '/api/v1/history', method: 'DELETE' }),
      invalidatesTags: ['History', 'HistoryStats'],
    }),

    // Stats summary
    getHistoryStats: builder.query({
      query: () => '/api/v1/history/stats/summary',
      providesTags: ['HistoryStats'],
    }),
  }),
})

export const {
  useGetHistoryQuery,
  useRecordOperationMutation,
  useGetHistoryEntryQuery,
  useDeleteHistoryEntryMutation,
  useClearHistoryMutation,
  useGetHistoryStatsQuery,
} = historyApi
