import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const userDataApi = createApi({
  reducerPath: 'userDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
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
