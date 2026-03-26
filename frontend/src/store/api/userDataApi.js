import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export const userDataApi = createApi({
  reducerPath: 'userDataApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Preferences', 'Gamification', 'Templates', 'UiSettings', 'Favorites', 'ToolStats', 'Pipelines'],
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

    // UI Settings (keybindings, tool_view, panel_sizes)
    getUiSettings: builder.query({
      query: () => '/api/v1/user/ui-settings',
      providesTags: ['UiSettings'],
    }),
    updateUiSettings: builder.mutation({
      query: (body) => ({ url: '/api/v1/user/ui-settings', method: 'PUT', body }),
      invalidatesTags: ['UiSettings'],
    }),

    // Favorites
    getFavorites: builder.query({
      query: () => '/api/v1/user/favorites',
      providesTags: ['Favorites'],
    }),
    addFavorite: builder.mutation({
      query: (toolId) => ({ url: `/api/v1/user/favorites/${toolId}`, method: 'POST' }),
      invalidatesTags: ['Favorites'],
    }),
    removeFavorite: builder.mutation({
      query: (toolId) => ({ url: `/api/v1/user/favorites/${toolId}`, method: 'DELETE' }),
      invalidatesTags: ['Favorites'],
    }),

    // Tool Stats (lifetime per-tool usage)
    getToolStats: builder.query({
      query: () => '/api/v1/user/tool-stats',
      providesTags: ['ToolStats'],
    }),

    // Pipelines
    getPipelines: builder.query({
      query: () => '/api/v1/user/pipelines',
      providesTags: ['Pipelines'],
    }),
    createPipeline: builder.mutation({
      query: (body) => ({ url: '/api/v1/user/pipelines', method: 'POST', body }),
      invalidatesTags: ['Pipelines'],
    }),
    updatePipeline: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/v1/user/pipelines/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Pipelines'],
    }),
    deletePipeline: builder.mutation({
      query: (id) => ({ url: `/api/v1/user/pipelines/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Pipelines'],
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
  useGetUiSettingsQuery,
  useUpdateUiSettingsMutation,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetToolStatsQuery,
  useGetPipelinesQuery,
  useCreatePipelineMutation,
  useUpdatePipelineMutation,
  useDeletePipelineMutation,
} = userDataApi
