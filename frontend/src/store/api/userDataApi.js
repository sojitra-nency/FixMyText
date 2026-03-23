import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export const userDataApi = createApi({
  reducerPath: 'userDataApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Preferences', 'Gamification', 'Templates'],
  endpoints: (builder) => ({
    // Preferences
    getPreferences: builder.query({
      query: () => '/api/v1/user/preferences',
      providesTags: ['Preferences'],
    }),
    updatePreferences: builder.mutation({
      query: (body) => ({ url: '/api/v1/user/preferences', method: 'PUT', body }),
      invalidatesTags: ['Preferences'],
    }),

    // Gamification
    getGamification: builder.query({
      query: () => '/api/v1/user/gamification',
      providesTags: ['Gamification'],
    }),
    updateGamification: builder.mutation({
      query: (body) => ({ url: '/api/v1/user/gamification', method: 'PUT', body }),
      invalidatesTags: ['Gamification'],
    }),

    // Templates
    getTemplates: builder.query({
      query: () => '/api/v1/user/templates',
      providesTags: ['Templates'],
    }),
    createTemplate: builder.mutation({
      query: (body) => ({ url: '/api/v1/user/templates', method: 'POST', body }),
      invalidatesTags: ['Templates'],
    }),
    updateTemplate: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/v1/user/templates/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Templates'],
    }),
    deleteTemplate: builder.mutation({
      query: (id) => ({ url: `/api/v1/user/templates/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Templates'],
    }),
  }),
})

export const {
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
  useGetGamificationQuery,
  useUpdateGamificationMutation,
  useGetTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = userDataApi
