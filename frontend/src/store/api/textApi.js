import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getVisitorId } from '../../hooks/useFingerprint'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const textApi = createApi({
  reducerPath: 'textApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      // Always send visitor fingerprint for server-side trial tracking
      headers.set('X-Visitor-Id', getVisitorId())
      return headers
    },
  }),
  endpoints: (builder) => ({
    transformText: builder.mutation({
      query: ({ endpoint, text, ...params }) => ({
        url: endpoint,
        method: 'POST',
        body: { text, ...params },
      }),
    }),
  }),
})

export const { useTransformTextMutation } = textApi
